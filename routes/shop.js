const express = require("express");
const {
  getProduct,
  getProductDetails,
  deleteProduct,
} = require("../controllers/Product");

const routes = express.Router();

routes.get("/", getProduct);

routes.post("/delete", deleteProduct);

routes.post("/", getProductDetails);

module.exports = routes;
