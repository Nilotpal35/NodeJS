const { ObjectId } = require("mongodb");
const { orderDataModel } = require("../models/orderDataModel");
const userDataModel = require("../models/userDataModel");
const fs = require("fs");
const path = require("path");
const { validationResult, matchedData } = require("express-validator");
const PDFDocument = require("pdfkit");

exports.getOrder = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        const { _id } = userInfo;
        orderDataModel
          .getOrder(_id.toString())
          .then((fetchedOrder) => {
            console.log("fetched order", fetchedOrder);
            const refinedOrder = fetchedOrder.flatMap((item) => {
              return item.details.map((i) => {
                return {
                  ...i,
                  date: item.date,
                  userId: item.userid.toString(),
                  orderId: item._id,
                };
              });
            });
            console.log("refined order", refinedOrder);
            res.status(200).render("Orders", {
              pageTitle: "Order",
              orders: refinedOrder,
              user: userInfo?.name,
              isAdmin: userInfo?.admin === "true",
              isAuth: true,
            });
          })
          .catch((err) => {
            return next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    //res.render("Orders", { pageTitle: "Order", isAuth: false });
    res.status(404).redirect("/login");
  }
};

exports.postOrder = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        const cartItems = userInfo.cart.map((item) => {
          if (item.prodId) {
            return new ObjectId(item.prodId);
          }
        });
        cartItems.length > 0
          ? userDataModel
              .getCart(cartItems)
              .then((fetchedCart) => {
                orderDataModel.sentToOrder(userInfo._id, fetchedCart);
                res.status(200).redirect("/order");
              })
              .then((res) => {
                const updatedUser = { ...userInfo, cart: [] };
                userDataModel.removeCart(updatedUser);
              })
              .catch((err) => {
                return next(err);
              })
          : res.status(200).render("Error", {
              pageTitle: "Error",
              error: "Your cart is empty!",
              user: userInfo?.name,
              isAdmin: userInfo?.admin === "true",
              isAuth: true,
            });
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.postInvoice = (req, res, next) => {
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
          order.details.map((item) => {
            finalInvoiceData.title.push(item.title);
            finalInvoiceData.price.push(item.price);
            finalInvoiceData.imageUrl.push(item.imageUrl);
            finalInvoiceData.description.push(item.description);
          });
          console.log("ORDER DETAILS", finalInvoiceData.title[0]);
          const doc = new PDFDocument();
          const filename = data.orderId + ".pdf";
          //change this path for the directory to save the pdfs
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
};
