const userDataModel = require("../models/userDataModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { validationResult, matchedData } = require("express-validator");

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
            res.status(422).render("Login", {
              pageTitle: "Login",
              formData: { email },
              errorMessage: "◉ Wrong email or password!",
            });
          } else if (result) {
            req.session.userId = userInfo._id;
            req.session.save((err) => {
              if (err) {
                return next(err);
              }
              req.flash("success", "◉ Successfully logged in!");
              res.status(200).redirect("/");
            });
          }
        });
      } else {
        res.status(422).render("Login", {
          pageTitle: "Login",
          formData: { email },
          errorMessage: "◉ Wrong email or password!",
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.clearCookie("connect.sid");
    res.status(200).redirect("/login");
  });
};

exports.postSignUp = (req, res, next) => {
  const { name, email, password, cnfPassword, dob } = req.body;
  let errorMessage = "";
  const error = validationResult(req);
  error.errors.map((item) => {
    errorMessage += "◉ " + item.msg;
  });
  if (errorMessage.trim().length > 0 && error.errors.length > 0) {
    res.status(422).render("Signup", {
      pageTitle: "Signup",
      errorMessage: errorMessage,
      formData: { name, email, password, cnfPassword, dob },
    });
  } else {
    const data = matchedData(req);
    bcrypt
      .hash(password, 12)
      .then((pwd) => {
        userDataModel
          .newUser({
            name: data.name,
            email: data.email,
            dob: data.dob,
            password: data.pwd,
            cart: [],
          })
          .then(() => {
            req.flash("success", "◉ Successfully Signed Up!");
            res.status(200).redirect("/login");
          });
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.getReset = (req, res, next) => {
  res.status(200).render("Reset", {
    pageTitle: "Reset",
    errorMessage: req.flash("error"),
  });
};

exports.postReset = (req, res, next) => {
  const { email, dob } = req.body;
  const error = validationResult(req);
  let errorMessage = "";
  error.errors.map((item) => {
    errorMessage += "◉ " + item.msg;
  });
  if (errorMessage.trim().length > 0 && error.errors.length > 0) {
    res.status(422).render("Reset", {
      pageTitle: "Reset",
      errorMessage: errorMessage,
      formData: { email, dob },
    });
  } else {
    const data = matchedData(req);
    userDataModel
      .getUserByEmail(data.email)
      .then((userInfo) => {
        if (userInfo) {
          if (userInfo.dob === data.dob) {
            crypto.randomBytes(32, (err, buffer) => {
              if (err) {
                res.status(422).redirect("/reset");
              } else {
                const token = buffer.toString("hex");
                const tokenVaility = Date.now() + 1000 * 60 * 2;
                userDataModel
                  .updateUser({ ...userInfo, token, tokenVaility })
                  .then((output) => {
                    res.status(200).render("ResetPassword", {
                      pageTitle: "ResetPassword",
                      resetToken: token,
                      resetTokenValidity: tokenVaility,
                      email: userInfo?.email,
                    });
                  })
                  .catch((err) => {
                    return next(err);
                  });
              }
            });
          } else {
            req.flash("error", "◉ INVALID CREDENTIALS");
            res.status(422).redirect("/reset");
          }
        } else {
          // res.render("Reset", {
          //   pageTitle: "Reset",
          //   errorMessage: "◉ NO USER FOUND!",
          //   formData: { email, dob },
          // });
          req.flash("error", "◉ INVALID CREDENTIALS");
          res.status(422).redirect("/reset");
        }
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.postResetPwd = (req, res, next) => {
  const { tokenAge, password, cnfPassword, email } = req.body;
  let errorMessage = "";
  const error = validationResult(req);
  error.errors.map((item) => {
    errorMessage += `\n ◉ ` + item.msg;
  });
  if (errorMessage.trim().length > 0 && error.errors.length > 0) {
    res.status(422).render("ResetPassword", {
      pageTitle: "ResetPassword",
      resetToken: req.params.tokenId,
      resetTokenValidity: tokenAge,
      email: email,
      formData: { password, cnfPassword },
      errorMessage: errorMessage,
    });
  } else {
    const token = req.params.tokenId;
    bcrypt
      .hash(password, 12)
      .then((pwd) => {
        userDataModel
          .getUserByEmail(email)
          .then((userInfo) => {
            if (
              userInfo &&
              token === userInfo.token &&
              Date.now() < userInfo.tokenVaility &&
              +tokenAge === userInfo.tokenVaility
            ) {
              const { _id, name, email, dob, cart } = userInfo;
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
                  res.status(200).redirect("/login");
                })
                .catch((err) => {
                  return next(err);
                });
            } else {
              //res.redirect("/login");
              res.status(422).render("Login", {
                pageTitle: "Login",
                errorMessage: "Time out!",
              });
            }
          })
          .catch((err) => {
            return next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  }
};
