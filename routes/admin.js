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
const fileValidator = require("../extra/fileValidator");

const router = express.Router();

router.get("/add-product", getAddProduct);

router.post(
  "/add-product",
  fileValidator,
  [
    body("title")
      .trim()
      .notEmpty()
      .isLength({ min: 5, max: 10 })
      .withMessage("Title should be in 5 to 10 letter"),
    // check("image")
    //   .trim()
    //   .notEmpty()
    //   .isMimeType()
    //   .withMessage("You have not entered any valid url"),
    body("price")
      .notEmpty()
      .custom((value, { req }) => {
        return +value > 0.1 && +value === +req.body.price;
      })
      .withMessage("Number should be more than 0.1 "),
    body("description")
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Description should be more than 10 characters"),
    body("_csrf").trim().notEmpty().withMessage("CSRF is not present"),
  ],
  postAddProduct
);

router.post("/edit", getEditProduct);

router.post(
  "/edit-product",
  fileValidator,
  [
    body("title")
      .trim()
      .notEmpty()
      .isLength({ min: 5, max: 10 })
      .withMessage("Title should be in 5 to 10 letter"),
    // check("imageUrl")
    //   .trim()
    //   .notEmpty()
    //   .isURL()
    //   .withMessage("You have not entered any valid url"),
    body("price")
      .notEmpty()
      .custom((value, { req }) => {
        if (+value > 0.1) {
          return value;
        } else {
          throw new Error("Number should be more than 0.1");
        }
      }),
    body("description")
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Description should be more than 10 characters"),
    body("_csrf").trim().notEmpty().withMessage("CSRF is not present"),
  ],
  postEditProduct
);

router.post("/delete", deleteProduct);

exports.admin = router;
