const express = require("express");
const router = express.Router();

const userRouter = require("./user-routes");
const errorMiddleware = require("../middlewares/error-middleware");

router.get("/", (_, res) => {
  res.json({ data: "Welcome to Memorella API" });
});

router.use("/users", userRouter);

router.use(errorMiddleware);

module.exports = router;
