require("dotenv").config();

const express = require("express");

const router = require("./app/routes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_APP_URL }));

app.use(express.urlencoded({ extended: true }), express.json());

app.use(router);

module.exports = app;
