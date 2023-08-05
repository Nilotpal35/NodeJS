const userDataModel = require("../models/userDataModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.getLogin = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel.getUserById(req.session?.userId, (userInfo) => {
      req.flash("success", "Successfully logged in!");
      res.redirect("/");
    });
  } else {
    // if(req.flash(''))
    res.render("Login", {
      pageTitle: "Login",
      errorMessage: req.flash("success"),
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
  userDataModel
    .getUserByEmail(email)
    .then((userInfo) => {
      if (userInfo) {
        bcrypt.compare(password, userInfo?.password).then((result) => {
          if (!result) {
            res.render("Login", {
              pageTitle: "Login",
              formData: { email },
              errorMessage: "◉ Wrong email or password!",
            });
          } else if (result) {
            req.session.userId = userInfo._id;
            req.session.save((err) => {
              if (err) {
                console.log(err);
              }
              req.flash("success", "◉ Successfully logged in!");
              res.redirect("/");
            });
          }
        });
      } else {
        res.render("Error", {
          error: "◉ No user found!",
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
  const { name, email, password, cnfPassword, dob } = req.body;
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
  if (dob.length !== 10) {
    errorMessage += "◉ Please enter proper date in DD/MM/YYYY format";
  }

  if (
    password !== cnfPassword ||
    !email.includes("@") ||
    name.length < 5 ||
    allUsers.includes(email) ||
    dob.length !== 10
  ) {
    res.render("Signup", {
      pageTitle: "Signup",
      errorMessage: errorMessage,
      formData: { name, email, password, cnfPassword, dob },
    });
  } else {
    bcrypt
      .hash(password, 12)
      .then((pwd) => {
        userDataModel
          .newUser({ name, email, dob, password: pwd, cart: [] })
          .then(() => {
            req.flash("success", "◉ Successfully Signed Up!");
            res.redirect("/login");
          });
      })
      .catch((err) => {
        throw err;
      });
  }
};

exports.getReset = (req, res, next) => {
  res.render("Reset", {
    pageTitle: "Reset",
    errorMessage: req.flash("error"),
  });
};

exports.postReset = (req, res, next) => {
  const { email, dob } = req.body;
  userDataModel
    .getUserByEmail(email)
    .then((result) => {
      if (result) {
        if (result.dob === dob) {
          // console.log("USER MATCHED!", result.dob);
          crypto.randomBytes(32, (err, buffer) => {
            if (err) {
              return res.redirect("/reset");
            } else {
              const token = buffer.toString("hex");
              const tokenVaility = Date.now() + 1000 * 60 * 2;
              userDataModel
                .updateUser({ ...result, token, token, tokenVaility })
                .then((output) => {
                  res.render("ResetPassword", {
                    pageTitle: "ResetPassword",
                    resetToken: token,
                    resetTokenValidity: tokenVaility,
                    email: result?.email,
                  });
                })
                .catch((err) => {
                  throw err;
                });
            }
          });
        } else {
          req.flash("error", "◉ INVALID CREDENTIALS");
          res.redirect("/reset");
        }
      } else {
        res.render("Reset", {
          pageTitle: "Reset",
          errorMessage: "◉ NO USER FOUND!",
          formData: { email, dob },
        });
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.postResetPwd = (req, res, next) => {
  const { tokenAge, password, cnfPassword, email } = req.body;
  const token = req.params.tokenId;
  let errorMessage = "";
  if (password !== cnfPassword) {
    errorMessage += "◉ Your password and confirm password is not macthing ";
    res.render("ResetPassword", {
      pageTitle: "ResetPassword",
      resetToken: token,
      resetTokenValidity: tokenAge,
      email: email,
      formData: { password, cnfPassword },
      errorMessage: errorMessage,
    });
  } else if (password === cnfPassword) {
    bcrypt
      .hash(password, 12)
      .then((pwd) => {
        userDataModel
          .getUserByEmail(email)
          .then((userInfo) => {
            const { _id, name, email, dob, cart } = userInfo;
            if (
              token === userInfo.token &&
              Date.now() < userInfo.tokenVaility &&
              +tokenAge === userInfo.tokenVaility
            ) {
              userDataModel
                .updateUser({
                  _id,
                  name,
                  email,
                  dob,
                  password: pwd,
                  cart,
                })
                .then((feedback) => {
                  req.flash("success", "◉ Password reset successfull");
                  res.redirect("/login");
                })
                .catch((err) => {
                  throw err;
                });
            } else {
              //res.redirect("/login");
              res.render("Login", {
                pageTitle: "Login",
                errorMessage: "Time out!",
              });
            }
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }
};
