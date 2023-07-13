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
  const fetchedData = [];
  productData.getData((bufferData) => {
    fetchedData.push(bufferData);
    console.log("data", fetchedData);
    const product = Buffer.concat(fetchedData).toString();
    if (product) {
      console.log("product exist", product && JSON.parse(product));
      return res.render("ProductPost", {
        pageTitle: "ProductPost",
        prods: product && JSON.parse(product),
      });
    } else {
      console.log("nothing existy");
      return res.render("ProductPost", {
        pageTitle: "ProductPost",
        prods: [],
      });
    }
    // if (product) {
    //   console.log("data present", product);
    // } else {
    //   console.log("no data", product);
    // }
    //   // res.render("ProductPost", {
    //   //   pageTitle: "ProductPost",
    //   //   prods: product,
    //   // });
    //   res.render("Error");
  });

  //res.render("Error");

  //res.sendFile(path.join(__dirname, "../", "views", "ProductPost.html"));
};
