// const products = [];
const { v4: uuidv4 } = require("uuid");
const { productDataModel } = require("../models/dataModel");

exports.getAddProduct = (req, res, next) => {
  res.render("AddProduct", {
    pageTitle: "Add Product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const formData = { id: uuidv4(), title, imageUrl, price, description };
  const store = new productDataModel();
  store.storeData(formData);
  res.redirect("/products");
};

exports.getProduct = (req, res, next) => {
  //new approach
  const products = [];
  productDataModel.getData((fetchedData) => {
    if (fetchedData) {
      const data = JSON.parse(fetchedData);
      products.push(...data);
    }
    res.render("Products", {
      pageTitle: "ProductPost",
      prods: products,
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const { prodId } = req.body;
  const product = [];
  productDataModel.getProduct(prodId, (fetchedData) => {
    if (fetchedData) {
      product.push(...fetchedData);
    }
    res.render("ProductDetail", {
      pageTitle: "Product Detail",
      prod: product,
    });
  });
};

exports.addCart = (req, res, next) => {
  const { prodId } = req.body;
  productDataModel.addCart(prodId);
  res.redirect("/cart");
};

exports.getCart = (req, res, next) => {
  const cartProducts = [];
  productDataModel.getCartList((fetchedData) => {
    if (fetchedData) {
      const data = JSON.parse(fetchedData);
      cartProducts.push(...data);
    }
    const totalPrice = cartProducts.reduce((acc, curr) => {
      return (acc = (+acc) + (+curr.price));
    }, 0);
    console.log("PRICE", totalPrice);
    res.render("Cart", {
      pageTitle: "Cart",
      prods: cartProducts,
      cartQty: cartProducts.length,
      totalPrice : totalPrice,
    });
  });
};

exports.deleteProduct = (req, res, next) => {
  const { prodId } = req.body;
  productDataModel.deleteProduct(prodId);
  res.redirect("/products");
};

exports.deleteCart = (req, res, next) => {
  const { prodId } = req.body;
  productDataModel.deleteCart(prodId);
  res.redirect("/cart");
};

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
