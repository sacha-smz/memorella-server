const express = require("express");
const router = express.Router();

const authRouter = require("./auth-routes");
const adminRouter = require("./admin-routes");
const userRouter = require("./user-routes");
const deckRouter = require("./deck-routes");
const errorMiddleware = require("../middlewares/error");
const notFoundMiddleware = require("../middlewares/not-found");

router.get("/", (_, res) => {
  res.json({ data: "Welcome to Memorella API" });
});

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/users", userRouter);
router.use("/decks", deckRouter);

router.use(notFoundMiddleware, errorMiddleware);

module.exports = router;
