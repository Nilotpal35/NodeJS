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
const loginRoute = require("./routes/login");
const cookieParser = require("cookie-parser");
const { redirect } = require("react-router-dom");
const session = require("express-session");

const MongoDbSession = require("connect-mongodb-session")(session);

const store = new MongoDbSession({
  uri: "mongodb+srv://Nilotpal35:Nilotpal123@nilotpal35.v7znesu.mongodb.net/",
  databaseName: "shop",
  collection: "session",
  //expires :
});

const app = express();

app.set("view engine", "pug");

app.use(body_parser.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use(cookieParser());

app.use(
  session({
    secret: "your-secret-key",
    resave: false, // Don't save the session if it wasn't modified
    saveUninitialized: false, // Don't create a session until something is stored
    // Additional options can be specified here, like cookie settings, etc.
    store: store,
  })
);

app.use("/login", loginRoute);
app.use((req, res, next) => {
  // console.log("fetched user id ", req.cookies.userId);
  // const userId = req.cookies.userId ? req.cookies.userId : null;
  // console.log("userId", userId);
  const userId = req.session.userId;
  if (userId) {
    userDataModel.getUserById(userId, (result) => {
      if (result) {
        console.log("USER AUTHENTICATED", result);
        req.user = result;
        next();
      } else {
        res.redirect("/login");
      }
    });
  } else {
    res.redirect("/login");
  }
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
