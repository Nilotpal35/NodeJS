const express = require("express");
const { getProduct } = require("../controllers/Product");
const { getHomePage } = require("../controllers/utility");

const routes = express.Router();

routes.get("/products", getProduct);

routes.get("/", getHomePage);

module.exports = routes;
