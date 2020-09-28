const fs = require("fs");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: {
    Bucket: process.env.AWS_S3_BUCKET,
    CacheControl: "must-revalidate"
  }
});

module.exports = {
  upload: (file, mimetype, key) => {
    return new Promise((resolve, reject) => {
      const filestream = fs.createReadStream(file);
      s3.upload({ Key: key, Body: filestream, ContentType: mimetype }, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }
};
