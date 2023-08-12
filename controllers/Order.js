const { ObjectId } = require("mongodb");
const { orderDataModel } = require("../models/orderDataModel");
const userDataModel = require("../models/userDataModel");

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

exports.postInvoice = (req, res, next) => {};
