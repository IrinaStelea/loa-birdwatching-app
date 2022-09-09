const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const uniqid = require("uniqid");
const path = require("path");

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


// {
//     popupimageUrl.length > 0 ? (
//         <div id="preview-images">
//             {popupimageUrl.map((img, idx) => (
//                 <img
//                     key={idx}
//                     id="bird-thumbnail"
//                     src={img}
//                     alt={popup.comName}
//                 />
//             ))}
//         </div>
//     ) : (
//         <img
//             id="bird-thumbnail"
//             src={selBird.length !== 0
//                     ? selBird[0].image
//                     : "../../default_pic.png"
//             }
//             alt={popup.comName}
//         />
//     );
// }