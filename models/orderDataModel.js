const { getDb } = require("../util/database");

class orderDataModel {
  static sentToOrder(userId, cartItems) {
    const db = getDb();
    db.collection("order")
      .insertOne({
        userid: userId,
        details: cartItems,
        date: new Date().toJSON(),
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        throw err;
      });
  }

  static getOrder(userId) {
    const db = getDb();
    return db
      .collection("order")
      .find({ userid: userId })
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
