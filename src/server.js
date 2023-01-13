//const express = require("express");
import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoute from "./route/web";
import initAPIRoute from "./route/api";
// import connection from "./configs/connectDB";

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000; //backup, .port or 3000

//cauhinh cho phep gui data tu client len phia server; body-parser da tich hop trong express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//setup viewEngine
configViewEngine(app);
//init web route (dieu huong website)
initWebRoute(app);

//inti api
initAPIRoute(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
