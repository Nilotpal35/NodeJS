const { validationResult } = require("express-validator");
const { newDataModel } = require("../models/cloudDataModel");
const userDataModel = require("../models/userDataModel");
const { ObjectId } = require("mongodb");

exports.getAddProduct = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel.getUserById(req.session?.userId).then((userInfo) => {
      res.render("AddProduct", {
        pageTitle: "Add Product",
        user: userInfo?.name,
        isAuth: true,
      });
    });
  } else {
    res.redirect("/login");
  }
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const formData = { title, imageUrl, price, description };
  const error = validationResult(req);
  let errorMessage = "";
  error.errors.map((item) => {
    errorMessage += `\n ◉ ` + item.msg;
  });
  if (errorMessage.trim().length > 0) {
    if (req.session?.userId) {
      userDataModel
        .getUserById(req.session?.userId)
        .then((userInfo) => {
          res.status(404).render("AddProduct", {
            pageTitle: "Add Product",
            user: userInfo?.name,
            formData: { title, imageUrl, price, description },
            isAuth: true,
            errorMessage: errorMessage,
          });
        })
        .catch((err) => {
          throw err;
        });
    } else {
      res.redirect("/login");
    }
  } else {
    const storeDb = new newDataModel();
    storeDb
      .store(formData)
      .then((result) => {
        console.log("NEW PRODUCT ADDED", result);
        res.redirect("/products");
      })
      .catch((err) => {
        throw err;
      });
  }
};

exports.getEditProduct = (req, res, body) => {
  if (req.session?.userId) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        const { prodId } = req.body;
        newDataModel.getDetails(prodId, (fetchedData) => {
          res.render("editProduct", {
            pageTitle: "Edit Product",
            product: fetchedData,
            user: userInfo?.name,
            isAuth: true,
          });
        });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/login");
  }
};

exports.postEditProduct = (req, res, next) => {
  const { _id, title, imageUrl, price, description } = req.body;
  const formData = { title, imageUrl, price, description };
  const error = validationResult(req);
  let errorMessage = "";
  error.errors.map((item) => {
    errorMessage += `\n ◉ ` + item.msg;
  });
  if (errorMessage.trim().length > 0 && error.errors.length > 0) {
    if (req.session?.userId) {
      userDataModel
        .getUserById(req.session?.userId)
        .then((userInfo) => {
          res.status(404).render("editProduct", {
            pageTitle: "Edit Product",
            user: userInfo?.name,
            product: { ...formData, _id },
            isAuth: true,
            errorMessage: errorMessage,
          });
        })
        .catch((err) => {
          throw err;
        });
    } else {
      res.redirect("/login");
    }
  } else {
    newDataModel
      .editData(_id, formData)
      .then(() => {
        res.redirect("/products");
      })
      .catch((err) => {
        throw err;
      });
  }
};

exports.getProduct = (req, res, next) => {
  const products = [];
  if (req.session?.userId) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        newDataModel.getData((fetchedData) => {
          if (fetchedData) {
            products.push(...fetchedData);
          }
          res.render("Products", {
            pageTitle: "ProductPost",
            prods: products.sort((a, b) => {
              if (a.title > b.title) {
                return 1;
              } else {
                return -1;
              }
            }),
            user: userInfo?.name,
            isAdmin: userInfo?.admin === "true",
            isAuth: true,
          });
        });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/login");
  }
};

exports.getProductDetails = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        const { prodId } = req.body;
        newDataModel.getDetails(prodId, (fetchedData) => {
          res.render("ProductDetail", {
            pageTitle: "Product Detail",
            prod: [fetchedData],
            user: userInfo?.name,
            isAdmin: userInfo?.admin === "true",
            isAuth: true,
          });
        });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/login");
  }
};

exports.addCart = async (req, res, next) => {
  const { prodId } = req.body;
  if (req.session?.userId) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        //userInfo.cart.push(prodId);
        if (userInfo.cart.length < 1) {
          userInfo.cart.push({ prodId: prodId, qty: 1 });
        } else {
          const productFound = userInfo.cart.find(
            (item) => item.prodId.toString() === prodId.toString()
          );
          console.log("product found", productFound);
          if (productFound) {
            const ExistingCartItem = userInfo.cart.filter(
              (item) => item.prodId !== productFound.prodId
            );
            productFound.qty += 1;
            ExistingCartItem.push(productFound);
            userInfo.cart = [...ExistingCartItem];
          } else {
            userInfo.cart.push({ prodId, qty: 1 });
          }
        }
        console.log("ADD - CART", userInfo);
        userDataModel
          .addCart(userInfo)
          .then((result) => {
            res.redirect("/cart");
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/login");
  }
};

exports.getCart = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        const cartItems = userInfo.cart.map((item) => {
          if (item.prodId) {
            return new ObjectId(item.prodId);
          }
        });
        userDataModel
          .getCart(cartItems)
          .then((fetchedCart) => {
            //const cartQty = req.session?.user.cart

            const totalPricee = fetchedCart.reduce((acc, cur) => {
              const qty = userInfo.cart.find(
                (item) => item.prodId.toString() === cur._id.toString()
              ).qty;
              return (acc = +acc + +cur.price * qty);
            }, 0);
            fetchedCart = fetchedCart.map((i) => {
              const qty = userInfo.cart.find(
                (item) => item.prodId.toString() === i._id.toString()
              ).qty;
              return { ...i, qty: qty };
            });
            const cartQty = fetchedCart.reduce((acc, curr) => {
              return (acc = acc + curr.qty);
            }, 0);

            fetchedCart.sort((a, b) => {
              if (a.title > b.title) {
                return 1;
              } else {
                return -1;
              }
            });
            res.render("Cart", {
              pageTitle: "Cart",
              prods: fetchedCart,
              cartQty: cartQty,
              totalPrice: totalPricee,
              user: userInfo?.name,
              isAdmin: userInfo?.admin === "true",
              isAuth: true,
            });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    // res.render("Cart", {
    //   pageTitle: "Cart",
    //   isAuth: false,
    // });
    res.redirect("/login");
  }
};

exports.deleteProduct = (req, res, next) => {
  const { prodId } = req.body;
  newDataModel
    .deleteProduct(prodId)
    .then(() => {
      res.redirect("/products");
    })
    .catch((err) => {
      throw err;
    });
};

exports.deleteCart = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        const { prodId } = req.body;
        if (userInfo.cart.length > 0) {
          const productFound = userInfo.cart.find(
            (item) => item.prodId.toString() === prodId.toString()
          );
          console.log("product found", productFound);
          if (productFound) {
            const ExistingCartItem = userInfo.cart.filter(
              (item) => item.prodId !== productFound.prodId
            );
            if (productFound.qty > 1) {
              productFound.qty -= 1;
              ExistingCartItem.push(productFound);
            }
            userInfo.cart = [...ExistingCartItem];
            userDataModel
              .removeCart(userInfo)
              .then(() => {
                res.redirect("/cart");
              })
              .catch((err) => {
                throw err;
              });
          } else {
            console.log("product not found");
            res.redirect("/cart");
          }
        } else {
          console.log("cart is empty");
          res.redirect("/cart");
        }
      })
      .catch((err) => {
        throw err;
      });
  }
};
