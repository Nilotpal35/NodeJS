const userDataModel = require("../models/userDataModel");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
  if (req.session?.userId) {
    console.log("session id", req.session?.userId);
    userDataModel.getUserById(req.session?.userId, (userInfo) => {
      res.redirect("/");
    });
  } else {
    res.render("Login", {
      pageTitle: "Login",
    });
  }
};

exports.getSignUp = (req, res, next) => {
  res.render("Signup", {
    pageTitle: "SignUp",
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  console.log("LOGIN FORM DATA", email, password);
  userDataModel
    .getUserByEmail(email)
    .then((userInfo) => {
      console.log("USER INFO", userInfo);
      if (userInfo) {
        bcrypt.compare(password, userInfo?.password).then((result) => {
          if (!result) {
            res.render("Login", {
              pageTitle: "Login",
              formData: { email },
              errorMessage: "Wrong password!",
            });
          } else if (result) {
            req.session.userId = userInfo._id;
            req.session.save((err) => {
              if (err) {
                console.log(err);
              }
              res.redirect("/");
            });
          }
        });
      } else {
        res.render("Error", {
          error: "No user found!",
        });
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};

exports.postSignUp = async (req, res, next) => {
  const { name, email, password, cnfPassword } = req.body;
  let errorMessage = "";
  const allUsers = [];
  await userDataModel.getAllUsers().then((result) => {
    allUsers.push(...result.map((item) => item.email));
  });

  if (email.includes("@") && allUsers.includes(email)) {
    errorMessage += "◉ User already exist";
  }
  if (name.length < 5) {
    errorMessage += "◉ Your name should be more than 5 characters ";
  }
  if (!email.includes("@")) {
    errorMessage += "◉ Please type a proper mail id ";
  }
  if (password !== cnfPassword) {
    errorMessage += "◉ Your password and confirm password is not macthing ";
  }

  if (
    password !== cnfPassword ||
    !email.includes("@") ||
    name.length < 5 ||
    allUsers.includes(email)
  ) {
    res.render("Signup", {
      pageTitle: "Signup",
      errorMessage: errorMessage,
      formData: { name, email, password, cnfPassword },
    });
  } else {
    bcrypt
      .hash(password, 12)
      .then((pwd) => {
        userDataModel
          .newUser({ name, email, password: pwd, cart: [] })
          .then(() => {
            res.redirect("/login");
          });
      })
      .catch((err) => {
        throw err;
      });
  }
};
