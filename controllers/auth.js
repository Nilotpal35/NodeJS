const userDataModel = require("../models/userDataModel");

exports.getLogin = (req, res, next) => {
  res.render("Login", {
    pageTitle: "Login",
    isAuth: req.session.userId && true,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  console.log("AUTH DETAILS", email, password);
  userDataModel
    .getUserByEmail(email)
    .then((result) => {
      console.log("FETCHED ID", result._id.toString());
      req.session.userId = result._id.toString();
      //req.session.userName = result.name.toString();
      res.redirect("/login");
    })
    .catch((err) => {
      res.redirect("/login");
    });
};
