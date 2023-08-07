const { Router } = require("express");

const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getReset,
  postReset,
  postResetPwd,
} = require("../controllers/Auth");
const { check } = require("express-validator");
const userDataModel = require("../models/userDataModel");

const router = Router();

router.get("/login", getLogin);

router.get("/signup", getSignUp);

router.get("/reset", getReset);

router.post("/login", postLogin);

router.post(
  "/signup",
  [
    check("email", "Please enter a valid mail")
      .trim()
      .notEmpty()
      .isEmail()
      .custom(async (value) => {
        const userInfo = await userDataModel.getUserByEmail(value);
        if (userInfo) {
          throw new Error("Email already in use!");
        }
      }),
    check("name", "Name must me minimum of 5 characaters")
      .isString()
      .notEmpty()
      .isLength({ min: 5 }),
    check(
      "password",
      "Password must be min of 6 char and contain letter and numbers"
    )
      .trim()
      .notEmpty()
      .isAlphanumeric()
      .isLength({ min: 6 }),
    check("cnfPassword", "Password not matched").custom((value, { req }) => {
      return value === req.body.password;
    }),
    check("dob", "Please enter a valid DOB").isDate(),
  ],
  postSignUp
);

router.post(
  "/reset",
  [
    check("email", "Invalid Email")
      .trim()
      .notEmpty()
      .isEmail()
      .custom(async (value) => {
        const userInfo = await userDataModel.getUserByEmail(value);
        if (!userInfo) {
          throw new Error("No user found with this mail id!");
        }
      }),
    check("dob", "Please enter a valid date").isDate(),
  ],
  postReset
);

router.post("/logout", postLogout);

router.post(
  "/reset-pwd/:tokenId",
  [
    check("tokenId", "Invalid token id").notEmpty().escape(),
    check("email", "Invalid Email").trim().notEmpty().isEmail(),
    check("password", "Password must be in six character long")
      .trim()
      .notEmpty()
      .isLength({ min: 6 }),
    check("cnfPassword", "Password not matched").custom((value, { req }) => {
      return value === req.body.password;
    }),
  ],
  postResetPwd
);

exports.AuthRoute = router;
