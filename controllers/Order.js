const { ObjectId } = require("mongodb");
const { orderDataModel } = require("../models/orderDataModel");
const userDataModel = require("../models/userDataModel");
const { validationResult, matchedData } = require("express-validator");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const { newDataModel } = require("../models/cloudDataModel");
const path = require("path");

exports.getOrder = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        const { _id } = userInfo;
        orderDataModel
          .getOrder(_id.toString())
          .then((fetchedOrder) => {
            console.log("raw order", fetchedOrder);
            const refinedOrder = fetchedOrder.flatMap((item) => {
              return item.details.map((i) => {
                return { ...i, date: item.date, userId: item.userid };
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
  let errorMessage = "";
  const error = validationResult(req);
  error.errors.map((item) => {
    errorMessage += "-> " + item.msg;
  });
  if (errorMessage.trim().length > 0 && error.errors.length > 0) {
    return next(new Error(errorMessage));
  } else {
    const prodId = matchedData(req).prodId;
    try {
      newDataModel.getDetails(prodId, (prodDetails) => {
        const doc = new PDFDocument();
        let filename = prodDetails.title + ".pdf";
        // filename = encodeURIComponent(filename + ".pdf");
        const filepath = path.join("store", filename);
        res.setHeader(
          "Content-disposition",
          'inline ; filename = "' + filename + '"'
        );
        res.setHeader("Content-type", "application/pdf");

        const content = prodDetails;
        doc.text(content.title);
        doc.text(content.price);
        doc.text(content.description);

        //for save the file on backend store folder
        doc.pipe(fs.createWriteStream(filepath));

        doc.pipe(res);
        doc.end();
      });
    } catch (error) {
      return next(error);
    }
  }
};
