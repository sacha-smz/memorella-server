require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const router = require("./app/routes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_APP_URL }));

app.use(express.static(path.resolve("public")));

app.use(express.urlencoded({ extended: true }), express.json());

app.use(router);

module.exports = app;
