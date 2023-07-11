const http = require("http");

const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.status(302).send("<h2>Hello friends</h2>");
});

app.listen(8080);
