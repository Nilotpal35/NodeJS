const express = require("express");
const { addCart, getCart, deleteCart } = require("../controllers/Product");

const routes = express.Router();

routes.get("/", getCart);

routes.get("/delete/:prodId", deleteCart);

routes.get("/add-cart/:prodId", addCart);

module.exports = routes;
