const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

const express = require("express");
const body_parser = require("body-parser");

const app = express();

app.set('view engine', 'pug')

app.use(body_parser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use("/admin", adminRoute.admin);

app.use("/", shopRoute.shop);

app.use((req, res, next) => {
  res.status(302).send("<h2>Page not found!</h2>");
});

app.listen(8080);
