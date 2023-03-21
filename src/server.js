//const express = require("express");
import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./routes/web";
import connectDB from "./configs/connectDB";
import cors from "cors";
import bodyParser from "body-parser";


require("dotenv").config();
const corsConfig = {
  credentials: true,
  origin: true,
}

const app = express();
app.use(cors(corsConfig));

const port = process.env.PORT || 8080; //backup, .port or 3000

//cauhinh cho phep gui data tu client len phia server; body-parser da tich hop trong express
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));


// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

//setup viewEngine
configViewEngine(app);
//init web route (dieu huong website)
initWebRoutes(app);
//connectDatabase
connectDB();

app.listen(port, () => {
  console.log(`Backend Nodejs running on port ${port}`);
});
