const path = require("path");

const { readFile, writeFile } = require("fs");

//creating a path for storage of data
const storePath = path.join(__dirname, "../", "store", "data.json");

function readFileFromStorage(cb) {
  readFile(storePath, (err, readData) => {
    if (!err) {
      cb(readData);
    } else {
      // in case file not exist to prevent from giving error,
      // it will return a empty Buffer.
      cb(Buffer.from(""));
    }
  });
}

//additional layer to process the buffer data and retutn
function readFunction(cb) {
  const fetchedData = [];
  readFileFromStorage((bufferData) => {
    fetchedData.push(bufferData);
    const product = Buffer.concat(fetchedData).toString();
    cb(product);
  });
}

//exports the class for product data store and fetch related logic
exports.productDataModel = class productData {
  constructor(item) {
    this.item = item;
  }

  //store the upcoming data from add-product and merge it with older data if present
  storeData() {
    const products = [];
    readFunction((f) => {
      if (f) {
        products.push(...JSON.parse(f));
      }
      products.push(this.item);
      writeFile(storePath, JSON.stringify(products), (err) => {
        if (err) {
          console.log("Error in writting new data", err);
        }
      });
    });
  }

  static getData(cb) {
    readFunction(cb);
  }
};

/// process to store data [OLD]
//semi older appraoch
// const fetchedData = [];
// readFileFromStorage((bufferData) => {
//   fetchedData.push(bufferData);
//   console.log("data", fetchedData);
//   const product = Buffer.concat(fetchedData).toString();
//   if (product) {
//     console.log("produt exist");
//     products.push(...JSON.parse(product));
//   } else {
//     console.log("no product");
//   }
//   products.push(this.item);
//   writeFile("data.json", JSON.stringify(products), (err) => {
//     if (err) {
//       console.log("Error in writting new data", err);
//     }
//   });
// });
//
//
// older approach
// readFile("data.json", (err, readData) => {
//   const products = [];
//   if (!err) {
//     products.push(...JSON.parse(readData));
//   }
//   products.push(this.item);
//   writeFile("data.json", JSON.stringify(products), (err) => {
//     if (err) {
//       console.log(err);
//     }
//   });
// });
