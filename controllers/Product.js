// const products = [];

const productData = require("../models/dataModel");

exports.getAddProduct = (req, res, next) => {
  res.render("AddProduct");
};

exports.postAddProduct = (req, res, next) => {
  const store = new productData(req.body.product);
  store.storeData();
  res.redirect("/products");
};

exports.getProduct = (req, res, next) => {
  productData.getData((product) => {
    res.render("ProductPost", {
      pageTitle: "ProductPost",
      prods: product,
    });
  });

  //res.sendFile(path.join(__dirname, "../", "views", "ProductPost.html"));
};
