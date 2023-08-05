const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class userDataModel {
  static newUser(formData) {
    const db = getDb();
    return db
      .collection("user")
      .insertOne(formData)
      .then(() => {
        return;
      })
      .catch((err) => {
        throw err;
      });
  }

  //get all the users email address
  static getAllUsers() {
    const db = getDb();
    return db
      .collection("user")
      .aggregate([{ $project: { _id: 0, email: "$email" } }])
      .toArray()
      .then((res) => {
        return res;
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

  static async updateUser(updatedData) {
    // console.log("UPDATED USER DATA WITH TOKEN", updatedData);
    const db = getDb();
    //await new Promise((res) => setTimeout(res, 1000));
    return db
      .collection("user")
      .updateOne(
        { _id: updatedData._id },
        {
          $set: {
            ...updatedData,
          },
        }
      )
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
