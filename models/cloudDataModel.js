const { getDb } = require("../util/database");
const { ObjectId } = require("mongodb");

class newDataModel {
  store(formData) {
    const db = getDb();
    return db
      .collection("product")
      .insertOne(formData)
      .then((result) => {
        console.log("One data saved", result);
      })
      .catch((err) => {
        throw "Some issue in saving data";
      });
  }

  static getData(cb) {
    const db = getDb();
    db.collection("product")
      .find()
      .toArray()
      .then((res) => {
        cb(res);
      })
      .catch((err) => {
        throw err;
      });
  }

  static getDetails(prodId, cb) {
    const db = getDb();
    db.collection("product")
      .find({ _id: new ObjectId(prodId) })
      .next()
      .then((res) => {
        console.log(res);
        cb(res);
      })
      .catch((err) => {
        throw err;
      });
  }

  static editData(_id, formData) {
    console.log("FORM DATA", formData);
    const db = getDb();
    db.collection("product")
      .updateOne({ _id: new ObjectId(_id) }, { $set: formData })
      .then((res) => {
        console.log("Updated!", res);
      })
      .catch((err) => {
        throw err;
      });
  }

  static deleteData(_id) {
    const db = getDb();
    db.collection("product")
      .deleteOne({ _id: new ObjectId(_id) })
      // .then((res) => {
      //   console.log("Deleted Successfully!", res);
      // })
      .catch((err) => {
        throw err;
      });
  }

  static addCart(prodId) {
    const cartItems = [];
    cartItems.push(prodId);
    const db = getDb();
    db.collection("cart")
      .insertOne({ cartItems })
      .then((res) => {
        console.log("Item added into cart!", res);
      })
      .catch((err) => {
        throw err;
      });
  }

  // static getCart() {
  //   const cartItems = [];
  //   const carts = [];
  //   const db = getDb();
  //   db.collection("cart")
  //     .find()
  //     .next()
  //     .then((res) => {
  //       console.log("RESPONSE FROM CART", res);
  //       res.cartItems.map((item) => {
  //         db.collection("product")
  //           .find({ _id: new ObjectId(item) })
  //           .next()
  //           // .then((res2) => {
  //           //   console.log("response from product", res2);
  //           //   carts.push(res2);
  //           // })
  //           .catch((err2) => {
  //             throw err2;
  //           });
  //       });
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  //   // cb(carts);
  // }
}

exports.newDataModel = newDataModel;
