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
const { orderDataModel } = require("../models/orderDataModel");
const fs = require("fs");
const path = require("path");
const { fileURLToPath } = require("url");

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
      console.log("alright", data.prodId, data.userId, data.orderId);
      orderDataModel
        .getOrderWithOrderId(data.orderId)
        .then((order) => {
          if (order) {
            const finalInvoiceData = {
              title: [],
              imageUrl: [],
              price: [],
              description: [],
            };
            const refinedOrder = order.details.map((item) => {
              // return {
              //   title: item.title,
              //   imageUrl: item.imageUrl,
              //   price: item.price,
              //   description: item.description,
              // };
              finalInvoiceData.title.push(item.title);
              finalInvoiceData.price.push(item.price);
              finalInvoiceData.imageUrl.push(item.imageUrl);
              finalInvoiceData.description.push(item.description);
            });
            console.log("ORDER DETAILS", finalInvoiceData.title[0]);
            const doc = new PDFDocument();
            const filename = data.orderId + ".pdf";
            const invoicePath = path.join("store", "invoice", filename);
            res.setHeader(
              "Content-Disposition",
              'inline ; filename"' + filename + '"'
            );
            res.setHeader("Content-Type", "application/pdf");
            doc.pipe(fs.createWriteStream(invoicePath));
            doc.pipe(res);
            if (finalInvoiceData.title.length > 1) {
              doc.text(finalInvoiceData.title[0], 50, 50);
              doc.text(finalInvoiceData.title[1], 50, 70);
              doc.text(finalInvoiceData.price[0], 150, 50);
              doc.text(finalInvoiceData.price[1], 150, 70);
              doc.fill("red");
              doc.text("Total Amount", 50, 100);
              doc.fill("green");
              doc.text(
                +finalInvoiceData.price[0] + +finalInvoiceData.price[1],
                150,
                100
              );
              doc.save();
            } else {
              doc.text(finalInvoiceData.title[0], 50, 50);
              doc.text(finalInvoiceData.price[0], 150, 50);
              doc.fill("red");
              doc.text("Total Amount", 50, 100);
              doc.fill("green");
              doc.text(finalInvoiceData.price[0], 150, 100);
              doc.save();
            }
            // doc.text(finalInvoiceData.imageUrl[0], 150, 150);
            // doc.text(finalInvoiceData.imageUrl[1], 170, 170);
            // doc.text(finalInvoiceData.description[0], 200, 200);
            // doc.text(finalInvoiceData.description[1], 220, 220);

            doc.end();
          } else {
            return next(new Error("No order history found with this user"));
          }
        })
        .catch((err) => {
          next(err);
        });
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
