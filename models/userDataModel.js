const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class userDataModel {
  newUser(formData) {
    const db = getDb();
    db.collection("user")
      .insertOne(formData)
      .then((res) => {
        console.log("User response", res);
      })
      .catch((err) => {
        throw err;
      });
  }

  static getUserByEmail(emailId) {
    const db = getDb();
    return db
      .collection("user")
      .findOne({ email: emailId })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static getUserById(userId) {
    const db = getDb();
    return db
      .collection("user")
      .findOne({ _id: new ObjectId(userId) })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static addCart(updatedData) {
    console.log("updated data", updatedData);
    const db = getDb();
    return db
      .collection("user")
      .updateOne(
        { _id: new ObjectId(updatedData._id) },
        {
          $set: {
            // name: updatedData.name,
            // email: updatedData.email,
            // cart: updatedData.cart,
            ...updatedData,
          },
        }
      )
      .then((res) => {
        console.log("item added into cart successfully", res);
        return res;
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
    return db
      .collection("user")
      .updateOne(
        { _id: new ObjectId(updatedUserData._id) },
        {
          $set: { ...updatedUserData },
        }
      )
      .then((res) => {
        console.log("Cart item removed successfully", res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = userDataModel;
