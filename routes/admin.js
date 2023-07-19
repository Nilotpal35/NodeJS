const express = require("express");
const path = require("path");
const {
  getAddProduct,
  postAddProduct,
  postEditProduct,
  getEditProduct,
} = require("../controllers/Product");

const router = express.Router();

router.get("/add-product", getAddProduct);

router.post("/add-product", postAddProduct);

router.post("/edit", getEditProduct);

router.post("/edit-product", postEditProduct);

exports.admin = router;
