const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const uniqid = require("uniqid");
const path = require("path");
const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("../secrets.json");
}

const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: secrets.AWS_KEY,
        secretAccessKey: secrets.AWS_SECRET,
    },
});

const s3Instance = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: "ihamspiced",
        acl: "public-read",
        // metadata: function (req, file, cb) {
        //     cb(null, { fieldName: uniquePath });
        // },
        key: function (req, file, cb) {
            cb(
                null,
                req.session.userId +
                    "/" +
                    req.session.sighting_id +
                    "/" +
                    uniqid() +
                    path.extname(file.originalname)
            );
        },
        contentType: function (req, file, cb) {
            cb(null, file.mimetype);
        },
        contentLength: function (req, file, cb) {
            cb(null, file.size);
        },
    }),
    limits: {
        fileSize: 2097152,
    },
});

exports.deleteS3 = (req, res, next) => {
    var params = {
        Bucket: "ihamspiced",
        Prefix: req.session.userId + "/" + req.body.id + "/",
    };

    return s3Instance
        .listObjects(params)
        .promise()
        .then((data) => {
            if (data.Contents.length === 0) {
                // throw new Error("List of objects empty.");
                console.log("list of objects empty");
                return next();
            }

            let currentData = data;

            params = { Bucket: "ihamspiced" };
            params.Delete = { Objects: [] };

            currentData.Contents.forEach((content) => {
                params.Delete.Objects.push({ Key: content.Key });
            });

            return s3Instance
                .deleteObjects(params)
                .promise()
                .then(() => {
                    // it worked!!!
                    console.log("amazon delete successful");
                    next(); //adding this because this function will be used as middleware
                })
                .catch((err) => {
                    // uh oh
                    console.log("error in delete object", err);
                    res.sendStatus(404);
                });
        });
};
