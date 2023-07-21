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
}

exports.newDataModel = newDataModel;
