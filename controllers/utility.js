exports.getHomePage = (req, res, next) => {
  res.render("Home", {
    pageTitle: "Home",
  });
};

exports.getErrorPage = (req, res, next) => {
  res.render("Error", {
    pageTitle: "Error 404",
  });
};
