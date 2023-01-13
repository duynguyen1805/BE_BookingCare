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
  router.get("/detail/user/:userId", homeController.getDetailPage);
  router.post("/create-new-user", homeController.createNewUser);
  router.post("/delete-user", homeController.deleteUser);
  router.get("/edit-user/:userId", homeController.getEditPage);
  router.post("/update-user", homeController.postUpdateUser);
  router.get("/upload", homeController.getUploadFilePage);
  router.post(
    "/upload-file-pic",
    upload.single("fileupload_pic"), //this is used middelware
    homeController.handleUploadFile
  );

  return app.use("/", router);
};

module.exports = initWebRoute;
