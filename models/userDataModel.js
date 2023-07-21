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

  getUserById(userId, cb) {
    const db = getDb();
    db.collection("user")
      .findOne({ _id: new ObjectId(userId) })
      .then((res) => {
        console.log("USER FOUND", res);
        cb(res);
      })
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = userDataModel;
