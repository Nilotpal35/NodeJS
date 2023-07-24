const { ObjectId } = require("mongodb");
const { orderDataModel } = require("../models/orderDataModel");
const userDataModel = require("../models/userDataModel");

exports.getOrder = (req, res, next) => {
  const { _id } = req.user;
  orderDataModel
    .getOrder(_id)
    .then((fetchedOrder) => {
      const details = [];
      fetchedOrder.map((item) => {
        details.push(...item.details);
      });
      res.render("Orders", {
        pageTitle: "Get",
        orders: details,
        user : req.user?.name,
        isAuth : req.session.userId || false,
      });
    })
    .catch((err) => {
      throw err;
    });
};

exports.postOrder = (req, res, next) => {
  const user = req.user;
  const cartItems = user.cart.map((item) => {
    if (item) {
      return new ObjectId(item);
    }
  });
  cartItems.length > 0
    ? userDataModel
        .getCart(cartItems)
        .then((fetchedCart) => {
          orderDataModel.sentToOrder(user._id, fetchedCart);
          res.redirect("/order");
        })
        .then((res) => {
          const updatedUser = { ...user, cart: [] };
          console.log("UPDATED USER", updatedUser);
          userDataModel.removeCart(updatedUser);
        })
        .catch((err) => {
          throw err;
        })
    : res.render("Error", {
        pageTitle: "Error",
        error: "Your cart is empty!",
        user : req.user?.name,
        isAuth :  req.session.userId || false,
      });
};
