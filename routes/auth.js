const { Router } = require("express");

const { getLogin, postLogin } = require("../controllers/Auth");

const routes = Router();

routes.get("/", getLogin);

routes.post("/", postLogin);

exports.AuthRoute = routes;
