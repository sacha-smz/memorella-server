const express = require("express");
const router = express.Router();

const userRouter = require("./user-routes");
const authRouter = require("./auth-routes");
const errorMiddleware = require("../middlewares/error");

router.get("/", (_, res) => {
  res.json({ data: "Welcome to Memorella API" });
});

router.use("/users", userRouter);
router.use("/auth", authRouter);

router.use(errorMiddleware);

module.exports = router;
