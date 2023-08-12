const express = require("express");
const { getOrder, postOrder } = require("../controllers/Order");
const { check, param, body, validationResult } = require("express-validator");
const userDataModel = require("../models/userDataModel");

const router = express.Router();

router.get("/", getOrder);

router.post("/", postOrder);

router.post(
  "/:prodId",
  [
    check("prodId", "No product id found").notEmpty().isAlphanumeric(),
    body("userId", "No user Id found")
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
  ],
  (req, res, next) => {
    console.log("in order invoice page ", req.body.userId);
    console.log("in order invoice page ", req.params.prodId);
    const error = validationResult(req);
    let errorMessage = "";
    error.errors.map((item) => {
      errorMessage += "=> " + item.msg;
    });
    if (errorMessage.trim().length > 0 && error.errors.length > 0) {
      next(new Error(errorMessage));
    } else {
    }
  }
);

exports.orderRoute = router;
