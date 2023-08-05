const userDataModel = require("../models/userDataModel");

module.exports = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel.getUserById(req.session?.userId).then((userInfo) => {
      if (userInfo) {
        if (userInfo?.admin === "true") {
          next();
        } else {
          res.render("Home", {
            pageTitle: "Home",
            user: userInfo.name,
            isAuth: true,
            errorMessage: "You dont have admin access",
          });
        }
      } else {
        res.redirect("/login");
      }
    });
  } else {
    res.redirect("/login");
  }
};
