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
const isAuth = require("./Auth/isAuth");
const nocache = require("nocache");
const cookieParser = require("cookie-parser");
// const {doubleCsrf} = require("csrf-csrf");
const csrf = require("csurf");
const flash = require("connect-flash");
const isAdmin = require("./Auth/isAdmin");

const MongoDbSession = require("connect-mongodb-session")(session);

const app = express();

//CSRF setting
// const { doubleCsrfProtection } = doubleCsrf({
//   getSecret: () => "_csrf",
//   // cookieName: "__Host-psifi.x-csrf-token", // The name of the cookie to be used, recommend using Host prefix.
//   // cookieOptions: {
//   //   sameSite: "lax", // Recommend you make this strict if posible
//   //   path: "/",
//   //   secure: true,
//   //   // Additional options supported: domain, maxAge, expires
//   // },
//   // size: 64, // The size of the generated tokens in bits
//   // ignoredMethods: ["GET", "HEAD", "OPTIONS"], // A list of request methods that will not be protected.
//   // getTokenFromRequest: (req) => req.headers["x-csrf-token"],
// });

//setting view engine as PUG
app.set("view engine", "pug");

app.use(flash());
//setting body-parser for reading static files
app.use(body_parser.urlencoded({ extended: false }));

//middleware for serve static CSS/JS files  in public folder
app.use(express.static("public"));

//mongodb-session
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

//this is for resetting the expiry of cookie
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

//this is for clearing the cache after user logs out
app.use(nocache());

// app.use(cookieParser());

//middleware for CSRF
// app.use(doubleCsrfProtection);
app.use(csrf());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", isAuth, isAdmin, adminRoute.admin);

app.use("/", AuthRoute);

app.use("/products", isAuth, shopRoute);

app.use("/product-detail", isAuth, shopRoute);

app.use("/cart", isAuth, cartRoute);

app.use("/order", isAuth, orderRoute);

app.use("/", homeRoute);

app.use(getErrorPage);

MongoConnect(() => {
  app.listen(8080);
});
