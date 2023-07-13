exports.getHomePage = (req, res, next) => {
  res.render("Home");
  //res.sendFile(path.join(__dirname, "../", "views", "Home.html"));
};

exports.getErrorPage = (req, res, next) => {
  res.render("Error");
};
