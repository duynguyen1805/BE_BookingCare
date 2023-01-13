// get the client
//const mysql = require('mysql2');
import mysql from "mysql2/promise";

console.log("Creating connection pool....");
// create the connection to database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "nodejsbasic",
  //password: "password",
});

export default pool;
