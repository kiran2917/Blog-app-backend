const multer = require("multer");
const path = require("path");
const fs = require("fs");

const cloudinary = require("../config/cloudinary");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const hasCloudinaryConfig =
  process.env.CLOUD_NAME &&
  process.env.API_KEY &&
  process.env.API_SECRET &&
  process.env.CLOUD_NAME !== "your_cloud_name" &&
  process.env.API_KEY !== "your_api_key" &&
  process.env.API_SECRET !== "your_api_secret";

let storage;

if (hasCloudinaryConfig) {
  storage = new CloudinaryStorage({
    cloudinary,

    params: {
      folder: "blogs"
    }
  });
} else {
  const uploadDir = path.join(__dirname, "..", "uploads", "blogs");

  fs.mkdirSync(uploadDir, {
    recursive: true
  });

  storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;

      cb(null, uniqueName);
    }
  });
}

module.exports = multer({ storage });
