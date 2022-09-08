const path = require("path");
const express = require("express");
const db = require("./db.js");
const jsonData = require("./apidata.json");
const birdData = require("./birddata_imgwiki.json");

const PORT = process.env.PORT || 3001;
const helpers = require("./helpers.js");
const app = express();
const cookieSession = require("cookie-session");
const { validateForm } = require("./validateForm");
const s3 = require("./s3");
const { uploader } = require("./middleware");

const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("../secrets.json").COOKIE_SECRET;

//cookie session middleware
app.use(
    cookieSession({
        secret: COOKIE_SECRET, //used to generate the 2nd cookie used to verify the integrity of 1st cookie
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

//https middleware
if (process.env.NODE_ENV == "production") {
    app.use((req, res, next) => {
        if (req.headers["x-forwarded-proto"].startsWith("https")) {
            return next();
        }
        res.redirect(`https://${req.hostname}${req.url}`);
    });
}

// const runImageUploadMiddleware = (req, res, next) => {
//     if (req.file) {
//         return uploader.single("file");
//     }
//     return next;
// };

app.post("/api/register", validateForm, (req, res) => {
    // console.log("req body", req.body);
    //add user to database, cleaning the data
    db.insertUser(
        helpers.cleanString(req.body.firstName),
        helpers.cleanString(req.body.lastName),
        req.body.email.toLowerCase(),
        req.body.password
    )
        .then((results) => {
            // console.log("inserting new user worked");
            //set the cookie session on the user id to keep track of login
            const userId = results.rows[0].id;
            req.session = {
                userId,
            };
            // console.log("user id cookie assigned", req.session.userId);
            //send success message
            return res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in adding new user", err);
            return res.json({
                success: false,
                message: "Something went wrong, please try again!",
            });
        });
});

app.post("/login.json", (req, res) => {
    db.validateUser(req.body.email.toLowerCase(), req.body.password)
        .then((result) => {
            // console.log("user id cookie assigned at login", result);
            //set the cookie
            req.session = {
                userId: result,
            };
            return res.json({
                success: true,
            });
        })
        .catch((err) => {
            // console.log("error in validating user", err);
            return res.json({
                success: false,
                message: "Invalid email or password",
            });
        });
});

//fetch for login
app.get("/user/id.json", function (req, res) {
    if (req.session.userId) {
        console.log("cookie is now set");
        res.json({
            userId: req.session.userId,
        });
    } else {
        console.log("cookie does not exist");
        res.json({});
    }
});

//serve the json with API sightings
app.get("/api/data.json", function (req, res) {
    //check data for duplicate coordinates and offset by a bit
    let dataUniqueCoord = helpers.randomizeIdenticalCoordinates(jsonData);

    //convert to geoJson
    let data = helpers.convertToGeojson(dataUniqueCoord);
    // console.log("inside the get request", data);

    res.json(data);
});

//serve the geojson with user sightings
app.get("/api/user-data.json", async (req, res) => {
    console.log("user id", req.session.userId);
    try {
        const result = await db.getUserSightings(req.session.userId);
        // console.log("result in get user data", result.rows);
        return res.json(result.rows);
    } catch (err) {
        console.log("error in getting user sightings");
        return res.json({ message: "Something went wrong, please try again" });
    }
});

//serve the json with bird data
app.get("/api/birddata.json", function (req, res) {
    res.json(birdData);
});

//add new sighting
app.post("/api/submit-pin", async (req, res) => {
    try {
        const result = await db.addSighting(
            req.session.userId,
            req.body.geoJSON
        );
        const sighting_id = result.rows[0].id;
        //store sighting id in cookie session in case user wants to add picture
        console.log("results after adding image", result.rows[0]);
        req.session = { ...req.session, sighting_id };
        console.log("req session after adding pin", req.session);
        return res.json(result.rows[0]);
    } catch (error) {
        console.log("error in adding new pin", error);
    }
});

app.post(
    "/api/upload-image",
    uploader.single("file"),
    s3.upload,
    async (req, res) => {
        //get the full URL of the image (amazon url + filename)
        const imageUrl = path.join(
            "https://s3.amazonaws.com/ihamspiced",
            //add the userId & sighting_id for access to subfolder
            `${req.session.userId}`,
            `${req.session.sighting_id}`,
            `${req.file.filename}`
        );

        try {
            const result = await db.addImage(
                req.session.userId,
                req.session.sighting_id,
                imageUrl
            );
            //clear sighting_id cookie stored
            req.session.sighting_id = null;

            return res.json({
                success: true,
                image: result.rows[0].image_url,
            });
        } catch (err) {
            console.log("error in uploading image", err);
            return res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        }
    }
);

//delete user sighting
app.post("/api/delete-user-marker", async (req, res) => {
    try {
        const result = await db.deleteSighting(req.body.id);
        // console.log("result deleting sighting", result)

        return res.json({ message: "success" });
    } catch (error) {
        console.log("error in deleting sighting", error);
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    console.log("inside the logout route");
    return res.json({});
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
