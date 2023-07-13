const express = require("express");
const path = require("path");
const { getAddProduct, postAddProduct } = require("../controllers/Product");

const router = express.Router();

router.get("/add-product", getAddProduct);

router.post("/add-product", postAddProduct);

exports.admin = router;
