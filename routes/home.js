const express = require("express");
const { getHomePage } = require("../controllers/utility");

const router = express.Router();

router.get("/", getHomePage);

module.exports = router;
