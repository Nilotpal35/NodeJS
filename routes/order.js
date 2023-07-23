const express = require("express");
const { getOrder, postOrder } = require("../controllers/Order");

const routes = express.Router();

routes.get("/", getOrder);

routes.post("/", postOrder);

exports.orderRoute = routes;
