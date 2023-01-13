import express from "express";
import homeController from "../controller/homeController";

import multer from "multer";
import path from "path";

var appRoot = require("app-root-path");
let router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + "/src/public/image/"); //appRoot: /thumucroot
  },

  filename: function (req, file, cb) {
    // dat filename khong trung
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = (req, file, cb) => {
  //accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "only image files are allowed!";
    return cb(new Error("only image files are allowed!"), false);
  }
  cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter });

const initWebRoute = (app) => {
  //method: post, get, put, delete
  //method get => client lay thong tin tu servers tra ve.
  router.get("/", homeController.getHomepage);

  return app.use("/", router);
};

module.exports = initWebRoute;
