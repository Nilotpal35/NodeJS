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
const fs = require("fs").promises;

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
  upload.single("image"),
  // [
  //   check("title")
  //     .trim()
  //     .notEmpty()
  //     .isLength({ min: 5 })
  //     .withMessage("Title should be in 5 to 10 letter"),
  //   // check("imageUrl")
  //   //   .trim()
  //   //   .notEmpty()
  //   //   .isURL()
  //   //   .withMessage("You have not entered any valid url"),
  //   check("price", "Number should be more than 0.1")
  //     .notEmpty()
  //     .custom((value, { req }) => {
  //       if (+value > 0.1) {
  //         return true;
  //       }
  //     }),
  //   check("description")
  //     .trim()
  //     .notEmpty()
  //     .isLength({ min: 5 })
  //     .withMessage("Description should be more than 10 characters"),
  // ],
  // // postAddProduct
  async (req, res, next) => {
    const { title, price, description, file } = req.body;
    console.log("ADD FORM DATA", title, price, description);
    console.log("file data", file);
    const fileData = file;
    if (fileData) {
      // const base64Data = fileData.buffer.toString("base64");
      // const fileExtension = path.extname(fileData.originalname);
      const fileName = "dummy" + ".avif";
      const filePath = path.join("store", "images", fileName);

      // Decode base64 data and write it to a file
      await fs.writeFile(filePath, Buffer.from(fileData, "base64"));

      console.log("File saved:", filePath);
    }
    res.status(200).json({ message: "Success!" });
  }
);

router.post("/edit", getEditProduct);

router.post(
  "/edit-product",
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
  postEditProduct
);

router.delete("/delete/:prodId", deleteProduct);

exports.admin = router;
