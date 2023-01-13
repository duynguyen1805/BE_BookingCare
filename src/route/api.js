import express from "express";
import apiController from "../controller/apiController";

let router = express.Router();

const initAPIRoute = (app) => {
  //method: post, get, put, delete
  //method get => client lay thong tin tu servers tra ve.
  router.get("/users", apiController.getAllUser); //method GET -> read data
  router.post("/create-user", apiController.createNewUser); //method POST -> creat data
  router.put("/update-user", apiController.updateUser); //method PUT -> edit/update data
  router.delete("/delete-user/:id", apiController.deleteUser); //method DELETE -> delete data

  return app.use("/api/v1/", router);
};

module.exports = initAPIRoute;
