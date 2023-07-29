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
const { AuthRoute } = require("./routes/auth");
const session = require("express-session");
const moment = require("moment");

const MongoDbSession = require("connect-mongodb-session")(session);

const app = express();

app.set("view engine", "pug");

app.use(body_parser.urlencoded({ extended: false }));

app.use(express.static("public"));

const store = new MongoDbSession({
  uri: "mongodb+srv://Nilotpal35:Nilotpal123@nilotpal35.v7znesu.mongodb.net/?retryWrites=true&w=majority",
  databaseName: "shop",
  collection: "session",
});

app.use(
  session({
    secret: "My secret key",
    resave: true,
    saveUninitialized: true,
    cookie: { expires: 1000 * 60 * 2 },
    rolling: true,
    store: store,
  })
);

// app.use((req, res, next) => {
//   req.session.
//   userDataModel.getUserById("64ba74e4a34824d578ad980c", (result) => {
//     if (result) {
//       console.log("USER AUTHENTICATED", result);
//       req.user = result;
//       next();
//     } else {
//       res.render("Error");
//     }
//   });
// });

app.use((req, res, next) => {
  const isAuthenticated = req.session && req.session?.userId;
  if (isAuthenticated) {
    req.session.cookie.expires = moment().add(5, "minutes").toDate();
  }

  //below code will clear the session if the user navigate to different tab
  // req.on("close", () => {
  //   req.session.destroy((err) => {
  //     console.log("ERROR IN DESTROTING SESSION", err);
  //   });
  // });

  next();
});

app.use("/admin", adminRoute.admin);

app.use("/", AuthRoute);

app.use("/products", shopRoute);

app.use("/product-detail", shopRoute);

app.use("/cart", cartRoute);

app.use("/order", orderRoute);

app.use("/", homeRoute);

app.use(getErrorPage);

MongoConnect(() => {
  app.listen(8080);
});
