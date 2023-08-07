const express = require("express");
// const path = require("path");
const { check, body } = require("express-validator");
const {
  getAddProduct,
  postAddProduct,
  postEditProduct,
  getEditProduct,
  deleteProduct,
} = require("../controllers/Product");

const router = express.Router();

router.get("/add-product", getAddProduct);

router.post(
  "/add-product",
  [
    check("title")
      .trim()
      .notEmpty()
      .isLength({ min: 5, max: 10 })
      .withMessage("Title should be in 5 to 10 letter"),
    check("imageUrl")
      .trim()
      .notEmpty()
      .isURL()
      .withMessage("You have not entered any valid url"),
    check("price")
      .notEmpty()
      .isDecimal()
      .custom((value, { req }) => {
        if (+value > 0.1) {
          return value;
        } else {
          throw new Error("Number should be more than 0.1");
        }
      }),
    check("description")
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Description should be more than 10 characters"),
  ],
  postAddProduct
);

router.post("/edit", getEditProduct);

router.post(
  "/edit-product",
  [
    check("title")
      .trim()
      .notEmpty()
      .isLength({ min: 5, max: 10 })
      .withMessage("Title should be in 5 to 10 letter"),
    check("imageUrl")
      .trim()
      .notEmpty()
      .isURL()
      .withMessage("You have not entered any valid url"),
    check("price")
      .notEmpty()
      .isDecimal()
      .custom((value, { req }) => {
        if (+value > 0.1) {
          return value;
        } else {
          throw new Error("Number should be more than 0.1");
        }
      }),
    check("description")
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Description should be more than 10 characters"),
  ],
  postEditProduct
);

router.post("/delete", deleteProduct);

exports.admin = router;
