const { Router } = require("express");

const { getLogin, postLogin, postLogout } = require("../controllers/Auth");

const routes = Router();

routes.get("/login", getLogin);

routes.post("/login", postLogin);

routes.post("/logout", postLogout);

exports.AuthRoute = routes;
