const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("../secrets.json");
}

//creating new instance of s3 user
const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        return res.sendStatus(500);
    }

    //boilerplate code - if we get at this point, req.file exists and we pull info from it

    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "ihamspiced",
            ACL: "public-read",
            // add userid to create subfolder on AWS for each user & for each sighting
            Key:
                req.session.userId +
                "/" +
                req.session.sighting_id +
                "/" +
                filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("amazon upload successful");
            next();
            fs.unlink(path, () => {}); //delete the img stored locally
        })
        .catch((err) => {
            // uh oh
            console.log("error in upload put object -s3.js", err);
            res.sendStatus(404);
        });
};

// exports.delete = (req, res, next) => {
//     var params = {
//         Bucket: "ihamspiced",
//         Prefix: req.session.userId + "/",
//     };

//     return s3
//         .listObjects(params)
//         .promise()
//         .then((data) => {
//             if (data.Contents.length === 0) {
//                 throw new Error("List of objects empty.");
//             }

//             let currentData = data;

//             params = { Bucket: "ihamspiced" };
//             params.Delete = { Objects: [] };

//             currentData.Contents.forEach((content) => {
//                 params.Delete.Objects.push({ Key: content.Key });
//             });

//             return s3
//                 .deleteObjects(params)
//                 .promise()
//                 .then(() => {
//                     // it worked!!!
//                     console.log("amazon delete successful");
//                     next(); //adding this because this function will be used as middleware
//                 })
//                 .catch((err) => {
//                     // uh oh
//                     console.log("error in delete object", err);
//                     res.sendStatus(404);
//                 });
//         });
// const promise = s3.deleteObject(params).promise();

// promise
//     .then(() => {
//         // it worked!!!
//         console.log("amazon delete successful");
//         next(); //adding this because this function will be used as middleware
//     })
//     .catch((err) => {
//         // uh oh
//         console.log("error in delete object", err);
//         res.sendStatus(404);
//     });
// };
