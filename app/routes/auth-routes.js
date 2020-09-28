const express = require("express");

const authMiddleware = require("../middlewares/auth");

const authController = require("../controllers/auth-controller");

const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.post("/logout", authMiddleware(), authController.logout);
authRouter.post("/refresh", authMiddleware("refresh"), authController.refresh);

module.exports = authRouter;
