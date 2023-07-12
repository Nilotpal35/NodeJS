const express = require("express");
const path = require("path");

const routes = express.Router();
const { products } = require("./admin");

routes.get("/products", (req, res, next) => {
  // console.log("req body", products);
  // res.render("ProductPost", {
  //   pageTitle: "ProductPost",
  //   prods: products,
  // });
  res.sendFile(path.join(__dirname, "../", "views", "ProductPost.html"));
});

// routes.get("/products", (req, res, next) => {
//   res.sendFile(path.join(__dirname, "../", "views", "ProductGet.html"));
// });

routes.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views", "Home.html"));
});

module.exports = {
  shop: routes,
  products: products,
};
