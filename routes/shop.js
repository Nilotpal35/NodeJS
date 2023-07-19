const express = require("express");
const {
  getProduct,
  getProductDetails,
  deleteProduct,
} = require("../controllers/Product");

const routes = express.Router();

routes.get("/", getProduct);

routes.get("/delete/:prodId", deleteProduct);

routes.get("/:prodId", getProductDetails);

module.exports = routes;
