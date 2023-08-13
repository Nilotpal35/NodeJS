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
const multer = require("multer");
const path = require("path");

const fileStoragePath = path.join("store", "images");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileStoragePath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const acceptedTypes = [".png", ".jpg", ".jpeg", ".gif", ".avif"];
  const extName = path.extname(file?.originalname).toLowerCase();
  if (acceptedTypes.includes(extName)) {
    cb(null, true);
  } else {
    cb(new Error("File should be an image"));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const router = express.Router();

router.get("/add-product", getAddProduct);

router.post(
  "/add-product",
  upload.single("imageUrl"),
  [
    check("title")
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Title should be in 5 to 10 letter"),
    // check("imageUrl")
    //   .trim()
    //   .notEmpty()
    //   .isURL()
    //   .withMessage("You have not entered any valid url"),
    check("price", "Number should be more than 0.1")
      .notEmpty()
      .custom((value, { req }) => {
        if (+value > 0.1) {
          return true;
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
  upload.single("imageUrl"),
  [
    check("title")
      .trim()
      .notEmpty()
      .isLength({ min: 5, max: 10 })
      .withMessage("Title should be in 5 to 10 letter"),
    // check("imageUrl")
    //   .trim()
    //   .notEmpty()
    //   .isURL()
    //   .withMessage("You have not entered any valid url"),
    check("price", "Number should be more than 0.1")
      .notEmpty()
      .custom((value, { req }) => {
        if (+value > 0.1) {
          return true;
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
