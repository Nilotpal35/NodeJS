const { MongoClient } = require("mongodb");

let _db;

const MongoConnect = (cb) => {
  MongoClient.connect(
    "mongodb+srv://Nilotpal35:Nilotpal123@nilotpal35.v7znesu.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      cb();
    })
    .catch((err) => {
      console.log("Some issue in connection", err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw "No Database Found";
  }
};

exports.MongoConnect = MongoConnect;
exports.getDb = getDb;
