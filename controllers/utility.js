const userDataModel = require("../models/userDataModel");

exports.getHomePage = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        res.status(200).render("Home", {
          pageTitle: "Home",
          user: userInfo.name,
          isAuth: true,
          isAdmin: userInfo?.admin === "true",
          errorMessage: req.flash("success"),
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(422).render("Home", {
      pageTitle: "Home",
      isAuth: false,
      errorMessage: req.flash("success"),
    });
  }
};

exports.getErrorPage = (req, res, next) => {
  if (req.session?.user) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        res.status(404).render("Error", {
          pageTitle: "Error 404",
          user: userInfo.name,
          isAdmin: userInfo?.admin === "true",
          isAuth: true,
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(422).render("Error", {
      pageTitle: "Error",
      isAuth: false,
    });
  }
};
