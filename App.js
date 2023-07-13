const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

const express = require("express");
const body_parser = require("body-parser");
const { getErrorPage } = require("./controllers/utility");

const app = express();

app.set("view engine", "pug");

app.use(body_parser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use("/admin", adminRoute.admin);

app.use("/", shopRoute);

app.use(getErrorPage);

app.listen(8080);
