const { getDb } = require("../util/database");

class orderDataModel {
  static sentToOrder(cartItems) {}

  static getOrder(userId) {
    const db = getDb();
    return db
      .collection("order")
      .find({ userId: userId })
      .toArray()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }
}

exports.orderDataModel = orderDataModel;
