exports.getLogin = (req, res, next) => {
  res.render("Login", {
    pageTitle: "Login",
    isAuth: false,
  });
};

exports.postLogin = (req, res, next) => {
  console.log("Sessions");
  res.redirect("/");
};
