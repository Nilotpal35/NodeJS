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

const router = Router();

router.get("/login", getLogin);

router.get("/signup", getSignUp);

router.get("/reset", getReset);

router.post("/login", postLogin);

router.post("/signup", postSignUp);

router.post("/reset", postReset);

router.post("/logout", postLogout);

router.post("/reset-pwd/:tokenId", postResetPwd);

exports.AuthRoute = router;
