const { getDb } = require("../util/database");
const { ObjectId } = require("mongodb");

class newDataModel {
  store(formData) {
    const db = getDb();
    return db
      .collection("product")
      .insertOne(formData)
      .then((result) => {
        return result;
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
    return db
      .collection("product")
      .updateOne({ _id: new ObjectId(_id) }, { $set: formData })
      .then((res) => {
        console.log("Updated!", res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static deleteProduct(_id) {
    const db = getDb();
    return db
      .collection("product")
      .deleteOne({ _id: new ObjectId(_id) })
      .then((res) => {
        console.log("Deleted Successfully!", res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static updateCart(prodId, action) {
    const db = getDb();
    db.collection("product")
      .findOne({ _id: new ObjectId(prodId) })
      .then((res) => {
        console.log("Item added into cart!", res);
        db.collection("product")
          .updateOne(
            { _id: new ObjectId(prodId) },
            { $set: { ...res, cart: action } }
          )
          .then((res2) => {
            console.log("succesfully updated", res2);
          })
          .catch((err2) => {
            throw err2;
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  static getCart(cb) {
    const db = getDb();
    db.collection("product")
      .find({ cart: true })
      .toArray()
      .then((res) => {
        console.log("CART PRODUCTS", res);
        cb(res);
      })
      .catch((err) => {
        throw err;
      });
  }
}

exports.newDataModel = newDataModel;
