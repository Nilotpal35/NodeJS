const { validationResult, matchedData } = require("express-validator");
const { newDataModel } = require("../models/cloudDataModel");
const userDataModel = require("../models/userDataModel");
const { ObjectId } = require("mongodb");

exports.getAddProduct = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel.getUserById(req.session?.userId).then((userInfo) => {
      res.status(200).render("AddProduct", {
        pageTitle: "Add Product",
        user: userInfo?.name,
        isAuth: true,
      });
    });
  } else {
    res.status(422).redirect("/login");
  }
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body;
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
          res.status(404).render("AddProduct", {
            pageTitle: "Add Product",
            user: userInfo?.name,
            formData: { title, price, description },
            isAuth: true,
            errorMessage: errorMessage,
          });
        })
        .catch((err) => {
          next(err);
        });
    } else {
      res.status(422).redirect("/login");
    }
  } else {
    console.log("Everything is fine in file upload");
    const data = matchedData(req);
    const formData = {
      title: data.title,
      imageUrl: req.file?.filename,
      price: data.price,
      description: data.description,
    };
    const storeDb = new newDataModel();
    storeDb
      .store(formData)
      .then((result) => {
        console.log("NEW PRODUCT ADDED", result);
        res.status(200).redirect("/products");
      })
      .catch((err) => {
        next(err);
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
          res.status(200).render("editProduct", {
            pageTitle: "Edit Product",
            product: fetchedData,
            user: userInfo?.name,
            prodId: prodId,
            isAuth: true,
          });
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(422).redirect("/login");
  }
};

exports.postEditProduct = (req, res, next) => {
  const { _id, prodId, title, price, description } = req.body;
  const form = { title, price, description };
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
            product: { ...form, _id },
            prodId: prodId,
            isAuth: true,
            errorMessage: errorMessage,
          });
        })
        .catch((err) => {
          next(err);
        });
    } else {
      res.status(422).redirect("/login");
    }
  } else {
    const data = matchedData(req);
    try {
      newDataModel.getDetails(req.body.prodId, (prodDetails) => {
        const formData = {
          title: (data.title && data.title) || prodDetails.title,
          imageUrl: req.file ? req.file?.filename : prodDetails.imageUrl,
          price: (data.price && data.price) || prodDetails.price,
          description:
            (data.description && data.description) || prodDetails.description,
        };
        newDataModel
          .editData(_id, formData)
          .then(() => {
            res.status(200).redirect("/products");
          })
          .catch((err) => {
            return next(err);
          });
      });
    } catch (error) {
      next(error.message);
    }
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
          res.status(200).render("Products", {
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
        next(err);
      });
  } else {
    res.status(422).redirect("/login");
  }
};

exports.getProductDetails = (req, res, next) => {
  if (req.session?.userId) {
    userDataModel
      .getUserById(req.session?.userId)
      .then((userInfo) => {
        const { prodId } = req.body;
        newDataModel.getDetails(prodId, (fetchedData) => {
          res.status(200).render("ProductDetail", {
            pageTitle: "Product Detail",
            prod: [fetchedData],
            user: userInfo?.name,
            isAdmin: userInfo?.admin === "true",
            isAuth: true,
          });
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(422).redirect("/login");
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
        userDataModel
          .addCart(userInfo)
          .then((result) => {
            res.status(200).redirect("/cart");
          })
          .catch((err) => {
            return next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(422).redirect("/login");
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
            res.status(200).render("Cart", {
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
            return next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    // res.render("Cart", {
    //   pageTitle: "Cart",
    //   isAuth: false,
    // });
    res.status(422).redirect("/login");
  }
};

exports.deleteProduct = (req, res, next) => {
  const { prodId } = req.body;
  newDataModel
    .deleteProduct(prodId)
    .then(() => {
      res.status(200).redirect("/products");
    })
    .catch((err) => {
      next(err);
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
                return next(err);
              });
          } else {
            res.status(404).redirect("/cart");
          }
        } else {
          res.status(404).redirect("/cart");
        }
      })
      .catch((err) => {
        next(err);
      });
  }
};
