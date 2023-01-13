import express from "express";

const configViewEngine = (app) => {
  //config render tu folder "views"
  app.use(express.static("./src/public")); //cho phep su dung thu muc "public"
  app.set("view engine", "ejs");
  app.set("views", "./src/views");
}; //"app" is express

export default configViewEngine; //share function giua cac file => export
