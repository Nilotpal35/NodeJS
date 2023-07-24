const { Router } = require("express");

const authController = require("../controllers/auth");

const routes = Router();

routes.get("/", authController.getLogin);

routes.post("/", authController.postLogin);

module.exports = routes;
