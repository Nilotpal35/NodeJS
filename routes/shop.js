const express = require("express");
const { getProduct } = require("../controllers/Product");

const routes = express.Router();

routes.get("/", getProduct);

module.exports = routes;
