const { Router } = require("express");

const { getLogin, postLogin, postLogout, getSignUp, postSignUp } = require("../controllers/Auth");

const routes = Router();

routes.get("/login", getLogin);

routes.get("/signup", getSignUp);

routes.post("/login", postLogin);

routes.post('/signup', postSignUp)

routes.post("/logout", postLogout);

exports.AuthRoute = routes;
