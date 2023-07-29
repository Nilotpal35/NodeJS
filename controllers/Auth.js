const userDataModel = require("../models/userDataModel");

exports.getLogin = (req, res, next) => {
  if (req.session?.userId) {
    console.log("session id", req.session?.userId);
    userDataModel.getUserById(req.session?.userId, (userInfo) => {
      res.redirect("/");
    });
  } else {
    res.render("Login", {
      pageTitle: "Login",
    });
  }
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  console.log("LOGIN FORM DATA", email, password);
  userDataModel
    .getUserByEmail(email)
    .then((userInfo) => {
      console.log("USER INFO", userInfo);
      req.session.userId = userInfo._id;
      return userInfo;
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      // res.redirect('/login');
      res.render("Login", {
        pageTitle: "Login",
        errorMessage: "Incorrect login credentails",
      });
      // throw err;
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
};
