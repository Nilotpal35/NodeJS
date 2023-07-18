exports.getHomePage = (req, res, next) => {
  res.render("Home");
};

exports.getErrorPage = (req, res, next) => {
  res.render("Error");
};
