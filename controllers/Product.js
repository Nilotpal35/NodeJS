// const products = [];
const { v4: uuidv4 } = require("uuid");
const { productDataModel } = require("../models/dataModel");
const { newDataModel } = require("../models/cloudDataModel");
const userDataModel = require("../models/userDataModel");
const { ObjectId } = require("mongodb");

exports.getAddProduct = (req, res, next) => {
  res.render("AddProduct", {
    pageTitle: "Add Product",
    user : req.user?.name
  });
};

//new way using mongo db;
exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const formData = { id: uuidv4(), title, imageUrl, price, description };
  const storeDb = new newDataModel();
  storeDb.store(formData);
  res.redirect("/products");
};

//old way
// exports.postAddProduct = (req, res, next) => {
//   const { title, imageUrl, price, description } = req.body;
//   const formData = { id: uuidv4(), title, imageUrl, price, description };
//   const store = new productDataModel();
//   store.storeData(formData);
//   res.redirect("/products");
// };

exports.getEditProduct = (req, res, body) => {
  const { prodId } = req.body;
  const product = [];
  newDataModel.getDetails(prodId, (fetchedData) => {
    if (fetchedData) {
      product.push(fetchedData);
    }
    res.render("editProduct", {
      pageTitle: "Edit Product",
      product: product[0],
      user : req.user?.name
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { _id, id, title, imageUrl, price, description } = req.body;
  const formData = { id, title, imageUrl, price, description };
  newDataModel.editData(_id, formData);
  res.redirect("/products");
};

//new way by using mongo db

exports.getProduct = (req, res, next) => {
  //new approach
  const products = [];
  newDataModel.getData((fetchedData) => {
    if (fetchedData) {
      products.push(...fetchedData);
    }
    res.render("Products", {
      pageTitle: "ProductPost",
      prods: products,
      user : req.user?.name
    });
  });
};

//old way by using file
// exports.getProduct = (req, res, next) => {
//   //new approach
//   const products = [];
//   productDataModel.getData((fetchedData) => {
//     if (fetchedData) {
//       const data = JSON.parse(fetchedData);
//       products.push(...data);
//     }
//     res.render("Products", {
//       pageTitle: "ProductPost",
//       prods: products,
//     });
//   });
// };

exports.getProductDetails = (req, res, next) => {
  const { prodId } = req.body;
  console.log("DETAILS", prodId);
  const product = [];
  newDataModel.getDetails(prodId, (fetchedData) => {
    if (fetchedData) {
      product.push(fetchedData);
    }
    res.render("ProductDetail", {
      pageTitle: "Product Detail",
      prod: product,
      user : req.user?.name
    });
  });
};

exports.addCart = async (req, res, next) => {
  const { prodId } = req.body;
  const userData = req.user;
  userData.cart.push(prodId);
  userDataModel.addCart(userData);
  res.redirect("/cart");
};

//new way of getting cart items
exports.getCart = (req, res, next) => {
  const user = req.user;
  console.log("cart items", user);
  const cartItems = user.cart.map((item) => {
    if (item) {
      return new ObjectId(item);
    }
  });
  console.log("cart items", cartItems);
  userDataModel
    .getCart(cartItems)
    .then((fetchedCart) => {
      const totalPrice = fetchedCart.reduce((acc, cur) => {
        return (acc = +acc + +cur.price);
      }, 0);
      res.render("Cart", {
        pageTitle: "Cart",
        prods: fetchedCart,
        cartQty: fetchedCart.length,
        totalPrice: totalPrice,
        user : req.user?.name
      });
    })
    .catch((err) => {
      throw err;
    });
  // userDataModel.getCart(cartItems, (fetchedCart) => {
  //   const totalPrice = fetchedCart.reduce((acc, cur) => {
  //     return (acc = +acc + +cur.price);
  //   }, 0);
  //   console.log("TOTAL PRICE", fetchedCart,totalPrice);

  //   res.render("Cart", {
  //     pageTitle: "Cart",
  //     prods: fetchedCart,
  //     cartQty: fetchedCart.length,
  //     totalPrice: totalPrice,
  //   });
  // });
};

//old way of getting cart items
// exports.getCart = (req, res, next) => {
//   const cartProducts = [];
//   productDataModel.getCartList((fetchedData) => {
//     if (fetchedData) {
//       const data = JSON.parse(fetchedData);
//       cartProducts.push(...data);
//     }
//     const totalPrice = cartProducts.reduce((acc, curr) => {
//       return (acc = +acc + +curr.price);
//     }, 0);
//     res.render("Cart", {
//       pageTitle: "Cart",
//       prods: cartProducts,
//       cartQty: cartProducts.length,
//       totalPrice: totalPrice,
//     });
//   });
// };

exports.deleteProduct = (req, res, next) => {
  const { prodId } = req.body;
  console.log("DELETE PRODUCT", prodId);
  newDataModel.deleteData(prodId);
  res.redirect("/products");
};

exports.deleteCart = (req, res, next) => {
  const { prodId } = req.body;
  const userData = req.user;
  userData.cart = userData.cart.filter((item) => item !== prodId);
  userDataModel.removeCart(userData);
  res.redirect("/cart");
};

// exports.deleteCart = (req, res, next) => {
//   const { prodId } = req.body;
//   newDataModel.updateCart(prodId, false);
//   setTimeout(() => {
//     res.redirect("/cart");
//   }, 1000);
// };

///OLDER APPROCHES FOR GETTING  STORED DATA FROM data.json file

//older approach
// const fetchedData = [];
// productData.getData((bufferData) => {
// fetchedData.push(bufferData);
// console.log("data", fetchedData);
// const product = Buffer.concat(fetchedData).toString();
// if (product) {
//   console.log("product exist", product && JSON.parse(product));
//   // return res.render("ProductPost", {
//   //   pageTitle: "ProductPost",
//   //   prods: product && JSON.parse(product),
//   // });
// } else {
//   console.log("nothing existy");
//   // res.render("ProductPost", {
//   //   pageTitle: "ProductPost",
//   //   prods: [],
//   // });
//   }
//   // if (product) {
//   //   console.log("data present", product);
//   // } else {
//   //   console.log("no data", product);
//   // }
//   // res.render("ProductPost", {
//   //   pageTitle: "ProductPost",
//   //   prods: product,
//   // });
//   // res.render("Error");
// });
