const { Router } = require("express");

const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getReset,
  postReset,
  postResetPwd,
} = require("../controllers/Auth");

const routes = Router();

routes.get("/login", getLogin);

routes.get("/signup", getSignUp);

routes.get("/reset", getReset);

routes.post("/login", postLogin);

routes.post("/signup", postSignUp);

routes.post("/reset", postReset);

routes.post("/logout", postLogout);

routes.post("/reset-pwd", postResetPwd);

exports.AuthRoute = routes;
