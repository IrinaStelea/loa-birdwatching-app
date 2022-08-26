let databaseUrl;
if (process.env.NODE_ENV === "production") {
    databaseUrl = process.env.DATABASE_URL;
} else {
    const {
        DB_USER,
        DB_PASSWORD,
        DB_HOST,
        DB_PORT,
        DB_NAME,
    } = require("../secrets.json");
    databaseUrl = `postgres:${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");
const db = spicedPg(databaseUrl);

function hashPassword(pass) {
    return (
        bcrypt
            .genSalt()
            .then((salt) => {
                return bcrypt.hash(pass, salt);
            })
            //generate the hash
            .then((hashedPassword) => {
                // console.log("password in hash function", hashedPassword);
                return hashedPassword;
            })
    );
}

module.exports.insertUser = (first, last, email, password) => {
    return hashPassword(password).then((hashedPass) => {
        // console.log("hashed pass", hashedPass);
        return db.query(
            //add user to users table returning the id & first name to store in the cookie session
            `
            INSERT INTO users(first, last, email, password)
            VALUES ($1, $2, $3, $4) RETURNING id, first`,
            [first, last, email, hashedPass]
        );
    });
};

module.exports.findUser = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

module.exports.validateUser = (email, inputPass) => {
    let userId;
    return db
        .query(`SELECT * FROM users WHERE email = $1`, [email])
        .then((results) => {
            console.log(
                "user email exists, here is the entire info",
                results.rows
            );
            //get db password
            let dbPass = results.rows[0].password;

            //get id from db
            userId = results.rows[0].id;

            //compare passwords
            return bcrypt.compare(inputPass, dbPass).then((result) => {
                if (result) {
                    console.log("authentication successful");
                    // const firstName = results.rows[0].first;
                    //return userId for the cookie
                    return userId;
                } else {
                    console.log("authentication failed. passwords don't match");
                    // throw error for the POST login catch
                    throw new Error("Passwords don't match");
                }
            });
        });
};

module.exports.getUserSightings = (id) => {
    return db.query(`SELECT id, sighting FROM sightings WHERE user_id=$1`, [
        id,
    ]);
};

module.exports.addSighting = (id, sighting) => {
    return db.query(
        `INSERT INTO sightings (user_id, sighting) VALUES($1, ($2)::jsonb) RETURNING id, sighting`,
        [id, JSON.stringify(sighting)]
    );
};

module.exports.deleteSighting = (id) => {
    return db.query(`DELETE FROM sightings WHERE id=$1`, [id]);
};
