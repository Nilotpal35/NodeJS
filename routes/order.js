const express = require("express");
const { getOrder, postOrder, postInvoice } = require("../controllers/Order");
const { check, body } = require("express-validator");

const router = express.Router();

router.get("/", getOrder);

router.post("/", postOrder);

router.post(
  "/:prodId",
  [
    check("prodId", "No product id found").notEmpty().isAlphanumeric(),
    body("userId", "No user found with this Id")
      .notEmpty()
      .isAlphanumeric()
      .custom((value, { req }) => {
        if (
          value === req.body.userId &&
          req.body.userId.toString() === req.session?.userId.toString()
        ) {
          return true;
        } else {
          return false;
        }
      }),
    body("orderId", "No Order found with this Id").trim().isAlphanumeric(),
  ],
  postInvoice
);

exports.orderRoute = router;
