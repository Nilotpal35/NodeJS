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
            const refinedOrder = fetchedOrder.flatMap((item) => {
              return item.details.map((i) => {
                return { ...i, date: item.date };
              });
            });
            console.log("fetchedOrder", refinedOrder);
            res.render("Orders", {
              pageTitle: "Order",
              orders: refinedOrder,
              user: userInfo?.name,
              isAdmin: userInfo?.admin === "true",
              isAuth: true,
            });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    //res.render("Orders", { pageTitle: "Order", isAuth: false });
    res.redirect("/login");
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
                res.redirect("/order");
              })
              .then((res) => {
                const updatedUser = { ...userInfo, cart: [] };
                console.log("UPDATED USER", updatedUser);
                userDataModel.removeCart(updatedUser);
              })
              .catch((err) => {
                throw err;
              })
          : res.render("Error", {
              pageTitle: "Error",
              error: "Your cart is empty!",
              user: userInfo?.name,
              isAdmin: userInfo?.admin === "true",
              isAuth: true,
            });
      })
      .catch((err) => {
        throw err;
      });
  }
};
