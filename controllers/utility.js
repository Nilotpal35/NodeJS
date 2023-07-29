const userDataModel = require("../models/userDataModel");

exports.getHomePage = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        res.render("Home", {
          pageTitle: "Home",
          user: userInfo.name,
          isAuth: true,
        });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.render("Home", {
      pageTitle: "Home",
      isAuth: false,
    });
  }
};

exports.getErrorPage = (req, res, next) => {
  if (req.session?.user) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        res.render("Error", {
          pageTitle: "Error 404",
          user: userInfo.name,
          isAuth: true,
        });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.render("Error", {
      pageTitle: "Error",
      isAuth : false
    });
  }
};
