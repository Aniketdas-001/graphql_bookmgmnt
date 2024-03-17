const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

// Configure AWS SDK with credentials and region
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: 'ap-south-1' // Update with your desired region
});

// Create an AWS S3 instance
const s3 = new aws.S3();

// Configure multer middleware for uploading book covers
const uploadBookCover = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'your-bucket-name', // Update with your S3 bucket name
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function(req, file, cb) {
      const fileName = `book-covers/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
  })
});

// Configure multer middleware for uploading user avatars
const uploadUserAvatar = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'your-bucket-name', // Update with your S3 bucket name
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function(req, file, cb) {
      const fileName = `user-avatars/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
  })
});

module.exports = {
  uploadBookCover,
  uploadUserAvatar
};
