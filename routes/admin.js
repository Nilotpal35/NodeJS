const express = require("express");
const path = require("path");

const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views", "AddProduct.html"));
});

router.post("/add-product", (req, res, next) => {
  products.push(req.body.product);
  res.redirect("/products");
});

exports.admin = router;
exports.products = products;
