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

  static getData(skip, page, cb) {
    const db = getDb();
    db.collection("product")
      .find({})
      .sort({ title: 1 })
      .skip(skip)
      .limit(page)
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
        cb(res);
      })
      .catch((err) => {
        throw err;
      });
  }

  static editData(_id, formData) {
    const db = getDb();
    return db
      .collection("product")
      .updateOne({ _id: new ObjectId(_id) }, { $set: formData })
      .then((res) => {
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
        db.collection("product")
          .updateOne(
            { _id: new ObjectId(prodId) },
            { $set: { ...res, cart: action } }
          )
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
        cb(res);
      })
      .catch((err) => {
        throw err;
      });
  }
}

exports.newDataModel = newDataModel;
