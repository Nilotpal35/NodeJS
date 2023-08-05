const express = require("express");
const { getProduct, getProductDetails } = require("../controllers/Product");

const router = express.Router();

router.get("/", getProduct);

router.post("/", getProductDetails);

module.exports = router;
