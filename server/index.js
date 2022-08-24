const path = require("path");
const express = require("express");
const db = require("./db.js");
const jsonData = require("./data.json");

const PORT = process.env.PORT || 3001;
const helpers = require("./helpers.js");
const app = express();
const cookieSession = require("cookie-session");

const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("../secrets.json").COOKIE_SECRET;

//cookie session middleware
app.use(
    cookieSession({
        secret: COOKIE_SECRET, //used to generate the 2nd cookie used to verify the integrity of 1st cookie
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

// Handle GET requests to /api route
// app.get("/api", (req, res) => {
//     res.json({ message: "Hello from server!" });
// });

app.post("/api/register", (req, res) => {
    // console.log("req body", req.body);
    //add user to database, cleaning the data
    db.insertUser(
        helpers.cleanString(req.body.firstName),
        helpers.cleanString(req.body.lastName),
        req.body.email.toLowerCase(),
        req.body.password
    )
        .then((results) => {
            console.log("inserting new user worked");
            //set the cookie session on the user id to keep track of login
            const userId = results.rows[0].id;
            // const firstName = results.rows[0].first;
            req.session = {
                userId,
                // firstName,
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
            console.log("user id cookie assigned at login", result);
            //set the cookie
            req.session = {
                userId: result,
            };
            return res.json({
                success: true,
            });
        })
        .catch((err) => {
            console.log("error in validating user", err);
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
    const data = helpers.convertToGeojson(jsonData);
    // console.log("inside the get request", data);
    res.json(data);
});

//serve the geojson with user sightings
app.get("/api/user-data.json", async (req, res) => {
    console.log("user id", req.session.userId);
    try {
        const result = await db.getUserSightings(req.session.userId);
        console.log("result in get user data", result.rows);
        let userData = [];
        for (let item of result.rows) {
            userData.push(item.sighting);
        }
        console.log("user data backend", userData);
        return res.json(userData);
    } catch (err) {
        console.log("error in getting user sightings");
        return res.json({ message: "Something went wrong, please try again" });
    }
});

//add new sighting
app.post("/api/submit-pin", async (req, res) => {
    try {
        const result = await db.addSighting(
            req.session.userId,
            req.body.geoJSON
        );
        console.log("result from adding pin", result.rows);
        return res.json({ message: "success" });
    } catch (error) {
        console.log("error in adding new pin", error);
    }
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
