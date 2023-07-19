const path = require("path");

const { readFile, writeFile, write, read } = require("fs");

//creating a path for storage of data
const storePath = path.join(__dirname, "../", "store", "data.json");
const cartPath = path.join(__dirname, "../", "store", "cart.json");

//read files mentioned in path
function readFileFromStorage(path, cb) {
  readFile(path, (err, readData) => {
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
function readFunction(path, cb) {
  const fetchedData = [];
  readFileFromStorage(path, (bufferData) => {
    fetchedData.push(bufferData);
    const product = Buffer.concat(fetchedData).toString();
    cb(product);
  });
}

//exports the class for product data store and fetch related logic
exports.productDataModel = class productData {
  //store the upcoming data from add-product form and merge it with older data if present
  storeData(formData) {
    const products = [];
    readFunction(storePath, (f) => {
      if (f) {
        products.push(...JSON.parse(f));
      }
      products.push(formData);
      writeFile(storePath, JSON.stringify(products), (err) => {
        if (err) {
          console.log("Error in writting new data", err);
        }
      });
    });
  }

  //get all products data from data.json
  static getData(cb) {
    readFunction(storePath, cb);
  }

  //get individual product data from data.json file
  static getProduct(prodId, cb) {
    const product = [];
    readFunction(storePath, (f) => {
      product.push(JSON.parse(f)?.find((item) => item.id === prodId));
      cb(product);
    });
  }

  //add new data into cart, cart.json file
  static addCart(prodId) {
    const cartProducts = [];
    readFunction(cartPath, (f) => {
      if (f) {
        cartProducts.push(...JSON.parse(f));
      }
      readFunction(storePath, (F) => {
        console.log(JSON.parse(F)?.find((item) => item.id === prodId));
        const productExist = cartProducts.filter((item) => item.id === prodId);
        if (productExist.length === 0) {
          cartProducts.push(JSON.parse(F)?.find((item) => item.id === prodId));
          writeFile(cartPath, JSON.stringify(cartProducts), (err) => {
            if (err) {
              console.log("Error in writting new data", err);
            }
          });
        }
      });
    });
  }

  //get list of cart items from cart.json file
  static getCartList(cb) {
    readFunction(cartPath, (f) => {
      cb(f);
    });
  }

  // delete the product item from data.json file
  static deleteProduct(prodId) {
    const products = [];
    readFunction(storePath, (f) => {
      products.push(...JSON.parse(f));
      const finalProduct = products.filter((item) => item.id !== prodId);
      writeFile(storePath, JSON.stringify(finalProduct), (err) => {
        if (err) {
          throw new Error("Some issue in deleting the product");
        }
      });
    });
  }

  //delete cart items from cart.json file
  static deleteCart(prodId) {
    const cartProducts = [];
    readFunction(cartPath, (f) => {
      cartProducts.push(...JSON.parse(f));
      const finalProduct = cartProducts.filter((item) => item.id !== prodId);
      writeFile(cartPath, JSON.stringify(finalProduct), (err) => {
        if (err) {
          throw new Error("Some issue in deleting the product from cart");
        }
      });
    });
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
