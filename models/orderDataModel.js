const { ObjectId } = require("mongodb");
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
      .catch((err) => {
        throw err;
      });
  }

  static getOrder(userId) {
    const db = getDb();
    return db
      .collection("order")
      .find({ userid: new ObjectId(userId) })
      .toArray()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static getOrderWithOrderId(orderId) {
    const db = getDb();
    return db
      .collection("order")
      .findOne({ _id: new ObjectId(orderId) })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }
}

exports.orderDataModel = orderDataModel;
