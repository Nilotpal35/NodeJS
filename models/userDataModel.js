const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class userDataModel {
  static newUser(formData) {
    const db = getDb();
    return db
      .collection("user")
      .insertOne(formData)
      .then((res) => {
        console.log("User response", res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static getUserByEmail(email) {
    const db = getDb();
    return db
      .collection("user")
      .findOne({ email: email })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static getUserById(userId, cb) {
    const db = getDb();
    if (userId) {
      db.collection("user")
        .findOne({ _id: new ObjectId(userId) })
        .then((res) => {
          cb(res);
        })
        .catch((err) => {
          throw err;
        });
    }
  }

  static addCart(updatedData) {
    const db = getDb();
    db.collection("user")
      .updateOne(
        { _id: new ObjectId(updatedData._id) },
        { $set: { ...updatedData } }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        throw err;
      });
  }

  static getCart(cartitems) {
    const db = getDb();
    return db
      .collection("product")
      .find({ _id: { $in: cartitems } })
      .toArray()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static removeCart(updatedUserData) {
    const db = getDb();
    db.collection("user")
      .updateOne(
        { _id: new ObjectId(updatedUserData._id) },
        { $set: { ...updatedUserData } }
      )
      .then((res) => {
        console.log("Cart item removed successfully", res);
      })
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = userDataModel;
