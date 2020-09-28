const express = require("express");

const adminMiddleware = require("../../middlewares/admin");

const deckRouter = require("./deck-routes");

const router = express.Router();

router.use(adminMiddleware);

router.use("/decks", deckRouter);

module.exports = router;
