const express = require("express");
const { addCart, getCart, deleteCart } = require("../controllers/Product");

const routes = express.Router();

routes.get("/", getCart);

routes.post("/delete", deleteCart);

routes.post("/add-cart", addCart);

module.exports = routes;
