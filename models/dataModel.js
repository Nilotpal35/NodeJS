const path = require("path");
const { readFile, writeFile, read } = require("fs");

const Products = [];

const readFileFromStorage = (cb) => {
  readFile("data.json", (err, readData) => {
    if (!err) {
      cb(readData);
    } else {
      cb([]);
    }
  });
};

module.exports = class productData {
  constructor(item) {
    this.item = item;
  }

  storeData() {
    readFile("data.json", (err, readData) => {
      const products = [];
      if (!err) {
        products.push(...JSON.parse(readData));
      }
      products.push(this.item);
      writeFile("data.json", JSON.stringify(products), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static getData(cb) {
    readFileFromStorage(cb);
  }
};
