//const express = require("express");
import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoute from "./route/web";
import connectDB from "./configs/connectDB";

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000; //backup, .port or 3000

//cauhinh cho phep gui data tu client len phia server; body-parser da tich hop trong express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

//setup viewEngine
configViewEngine(app);
//init web route (dieu huong website)
initWebRoute(app);
//connectDatabase
connectDB();

app.listen(port, () => {
  console.log(`Backend Nodejs running on port ${port}`);
});
