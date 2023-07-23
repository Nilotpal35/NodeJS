const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const homeRoute = require("./routes/home");
const cartRoute = require("./routes/cart");
const express = require("express");
const body_parser = require("body-parser");
const { getErrorPage } = require("./controllers/utility");

const { MongoConnect } = require("./util/database");
const userDataModel = require("./models/userDataModel");
const { orderRoute } = require("./routes/order");

const app = express();

app.set("view engine", "pug");

app.use(body_parser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use((req, res, next) => {
  userDataModel.getUserById("64ba74e4a34824d578ad980c", (result) => {
    if (result) {
      console.log("USER AUTHENTICATED", result);
      req.user = result;
      next();
    } else {
      res.render("Error");
    }
  });
});

app.use("/admin", adminRoute.admin);

app.use("/products", shopRoute);

app.use("/product-detail", shopRoute);

app.use("/cart", cartRoute);

app.use("/order", orderRoute);

app.use("/", homeRoute);

app.use(getErrorPage);

MongoConnect(() => {
  app.listen(8080);
});
