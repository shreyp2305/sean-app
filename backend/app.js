// imports
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql2');
require('dotenv').config();

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

// handles post requests
app.post("/api/posts", (req, res, next) => {
  const posts = req.body;
  console.log(posts);
  res.status(201).json({
    message: "Post added succuesfully",
  });
});

// handles get requests
app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "adfs87ej",
      title: "First server-side post",
      content: "This is coming from the server",
    },
    {
      id: "wiu3f8hw",
  title: "Second serve-side post",
      content: "This is also coming from the server",
    },
  ];
  return res.status(200).json({
    message: "Post fetched successfully",
    posts: posts,
  });
});


// MySQL connection
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.LOCAL_DB_PASS,
  database: 'books_db'
});
var q = 'SELECT title AS title, released_year AS release_date FROM books WHERE released_year > 2000 AND CHAR_LENGTH(title) < 20';
connection.query(q, function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});
connection.end();

module.exports = app;
