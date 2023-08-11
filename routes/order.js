const express = require("express");
const { getOrder, postOrder, postInvoice } = require("../controllers/Order");
const { check, param, body } = require("express-validator");

const router = express.Router();

router.get("/", getOrder);

router.post("/", postOrder);

router.post(
  "/:prodId",
  [
    param("prodId", "Product id missing")
      .trim()
      .notEmpty()
      .isAlphanumeric()
      .custom((value, { req }) => {
        if (value) {
          return true;
        }
      }),
    body("userId", "not authorized")
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        if (value === req.body.userId) {
          if (req.session?.userId.toString() === req.body.userId) {
            return true;
          }
        }
      }),
  ],
  postInvoice
);

exports.orderRoute = router;
