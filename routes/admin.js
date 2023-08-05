const express = require("express");
const path = require("path");
const {
  getAddProduct,
  postAddProduct,
  postEditProduct,
  getEditProduct,
  deleteProduct,
} = require("../controllers/Product");

const router = express.Router();

router.get("/add-product", getAddProduct);

router.post("/add-product", postAddProduct);

router.post("/edit", getEditProduct);

router.post("/edit-product", postEditProduct);

router.post("/delete", deleteProduct);

exports.admin = router;
