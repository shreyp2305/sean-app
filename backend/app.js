const express = require("express");
const db = require('./models/index');
const mysql = require('mysql2');
require('dotenv').config();
const postRouter = require("./routes/post.router");
const bodyParser = require("body-parser");
const path = require("path");


// required code
const app = express();
app.use((req, res, next) => {
  // handles CORS error
  // code bellow exposes server to be exposed to all possible clients
  // it disables the default security measure which stops other
  // servers from accessing the data on your server if they are not running on your server
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/assets/post_images")))

// Routers
app.use("/api/posts", postRouter);

// MySQL connection
// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: process.env.LOCAL_DB_PASS,
//   database: 'newsletter_db'
// });
// connection.end();

module.exports = app;
