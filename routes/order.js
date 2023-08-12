const express = require("express");
const { getOrder, postOrder } = require("../controllers/Order");
const {
  check,
  param,
  body,
  validationResult,
  matchedData,
} = require("express-validator");
const userDataModel = require("../models/userDataModel");
const PDFDocument = require("pdfkit");
const { newDataModel } = require("../models/cloudDataModel");

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
      const data = matchedData(req);
      console.log("alright", data.prodId, data.userId);
      // newDataModel.getDetails(data.prodId, (prodDetail) => {
      //   if (prodDetail) {
      //     console.log("prod details", prodDetail);
      //     const doc = new PDFDocument();
      //     const filename = prodDetail.title + ".pdf";
      //     res.setHeader(
      //       "Content-disposition",
      //       'inline; filename="' + filename + '"'
      //     );
      //     res.setHeader("Content-type", "application/pdf");
      //     doc.text(prodDetail.description);
      //     doc.pipe(res);
      //     // doc.pipe();
      //     doc.end();
      //   } else {
      //     return next(new Error("No product found!"));
      //   }
      // });
    }
  }
);

exports.orderRoute = router;
