// const products = [];

const { productDataModel } = require("../models/dataModel");

exports.getAddProduct = (req, res, next) => {
  res.render("AddProduct");
};

exports.postAddProduct = (req, res, next) => {
  const store = new productDataModel(req.body.product);
  store.storeData();
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

///OLDER APPROCHES FOR GETTING STORED DATA FROM data.json file

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
