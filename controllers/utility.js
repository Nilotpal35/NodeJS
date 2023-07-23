exports.getHomePage = (req, res, next) => {
  res.render("Home", {
    pageTitle: "Home",
    user : req.user?.name
  });
};

exports.getErrorPage = (req, res, next) => {
  res.render("Error", {
    pageTitle: "Error 404",
    user : req.user?.name
  });
};
