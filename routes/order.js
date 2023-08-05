const express = require("express");
const { getOrder, postOrder } = require("../controllers/Order");

const router = express.Router();

router.get("/", getOrder);

router.post("/", postOrder);

exports.orderRoute = router;
