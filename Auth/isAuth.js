const userDataModel = require("../models/userDataModel");

module.exports = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel.getUserById(req.session?.userId).then((userInfo) => {
      if (userInfo) {
        next();
      } else {
        res.redirect("/login");
      }
    });
  } else {
    res.redirect("/login");
  }
};
