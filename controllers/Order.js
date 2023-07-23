exports.getOrder = (req, res, next) => {
  res.render("Orders", {
    pageTitle: "Get",
  });
};

exports.postOrder = (req, res, next) => {
  const product = req.body.prod;
  console.log("Prod", product);
  res.render("Orders", {
    pageTitle: "Post",
  });
};
