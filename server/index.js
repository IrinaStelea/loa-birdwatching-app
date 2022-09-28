const express = require("express");
const app = express();
const path = require("path");
const fetch = require("node-fetch");
const cookieSession = require("cookie-session");
const multer = require("multer");
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("../secrets.json").COOKIE_SECRET;
const EBIRD_TOKEN =
    process.env.EBIRD_TOKEN || require("../secrets.json").EBIRD_TOKEN;

const PORT = process.env.PORT || 3001;

const db = require("./db.js");
const helpers = require("./helpers.js");
const { validateForm } = require("./validateForm");
const { uploadS3, deleteS3 } = require("./s3");
const birdData = require("./birddata_imgwiki.json");
// const jsonData = require("./apidata.json"); //version of API data on storage

//cookie session middleware
app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//force https
if (process.env.NODE_ENV == "production") {
    app.use((req, res, next) => {
        res.setHeader(
            "Strict-Transport-Security",
            "max-age=8640000; includeSubDomains"
        );
        if (req.headers["x-forwarded-proto"].startsWith("https")) {
            return next();
        }
        return res.redirect(`https://${req.hostname}${req.url}`);
    });
}

if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.resolve(__dirname, "../client/build")));
} else {
    app.use(express.static(path.join(__dirname, "..", "client", "public")));
}

//pre-login route
app.get("/user/id.json", function (req, res) {
    if (req.session.userId) {
        // console.log("cookie is now set");
        res.json({
            userId: req.session.userId,
        });
    } else {
        // console.log("cookie does not exist");
        res.json({});
    }
});

//post route for API fetch for the bird sightings
app.post("/api/data.json", async function (req, res) {
    let requestOptions = {
        method: "GET",
        headers: { "X-eBirdApiToken": EBIRD_TOKEN },
        redirect: "follow",
    };

    let lat = req.body.lat;
    let lng = req.body.lng;

    const response = await fetch(
        `https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lng}&back=30&dist=50`,
        requestOptions
    );
    const APIdata = await response.json();

    //check data for duplicate coordinates and offset by a bit
    let dataUniqueCoord = helpers.randomizeIdenticalCoordinates(APIdata);

    //convert to geoJson
    let data = helpers.convertToGeojson(dataUniqueCoord);

    res.json(data);
});

//serve the geojson with user sightings
app.get("/api/user-data.json", async (req, res) => {
    console.log("user id", req.session.userId);
    try {
        const result = await db.getUserSightings(req.session.userId);
        console.log("user data", result);
        //merge user images for the same sighting
        const mergedResult = helpers.mergeIdenticalSightings(result.rows);
        return res.json(mergedResult);
    } catch (err) {
        // console.log("error in getting user sightings");
        return res.json({ message: "Something went wrong, please try again" });
    }
});

//serve the json with bird information
app.get("/api/birddata.json", function (req, res) {
    res.json(birdData);
});

//post for registration route
app.post("/api/register", validateForm, (req, res) => {
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
            return res.json({ success: true });
        })
        .catch((err) => {
            // console.log("error in adding new user", err);
            return res.json({
                success: false,
                message: "Something went wrong, please try again!",
            });
        });
});

//post for login route
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

//add new user sighting
app.post("/api/submit-pin", async (req, res) => {
    try {
        const result = await db.addSighting(
            req.session.userId,
            req.body.geoJSON
        );
        const sighting_id = result.rows[0].id;
        //store sighting_id in cookie session in case user wants to add picture
        req.session = { ...req.session, sighting_id };
        return res.json(result.rows[0]);
    } catch (error) {
        console.log("error in adding new pin", error);
        return res.json({
            success: "false",
            error: "Something went wrong, please try again",
        });
    }
});

//add user images
app.post("/api/upload-image", async (req, res) => {
    uploadS3(req, res, async function (err) {
        //first handle Multer file validation errors
        if (err instanceof multer.MulterError) {
            return res.json({
                success: false,
                error: err.message,
            });
        } else if (err) {
            return res.json({
                success: false,
                error: err.message,
            });
        }
        //get the full URL of the image (amazon url + filename)
        let fileArray = req.files;
        let imgUrlArray = [];
        for (let i = 0; i < fileArray.length; i++) {
            imgUrlArray.push(fileArray[i].location);
        }

        try {
            const result = await db.addImage(
                req.session.userId,
                req.session.sighting_id,
                imgUrlArray
            );
            //clear sighting_id cookie stored
            req.session.sighting_id = null;
            // console.log("result from adding multiple images", result.rows);
            return res.json({
                success: true,
                images: result.rows,
            });
        } catch (err) {
            // console.log("error in uploading image", err);
            return res.json({
                success: false,
                error: "Something went wrong, please try again",
            });
        }
    });
});

//delete user sighting including images from S3 if available
app.post("/api/delete-user-marker", deleteS3, async (req, res) => {
    try {
        const result = await db.deleteSighting(req.body.id);
        if (result.rowCount > 0) {
            return res.json({ message: "success" });
        } else {
            return res.json({
                error: "Something went wrong, please try again",
            });
        }
    } catch (error) {
        console.log("error in deleting sighting", error);
        return res.json({
            error: "Something went wrong, please try again",
        });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    return res.json({});
});

//NOTE: the index.html will be in the build folder after compiling
if (process.env.NODE_ENV == "production") {
    app.get("/*", (req, res) => {
        res.sendFile(path.resolve("client", "build", "index.html"));
    });
} else {
    app.get("/*", (req, res) => {
        res.sendFile(path.resolve("client", "public", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
