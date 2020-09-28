const express = require("express");

const deckController = require("../controllers/deck-controller");

const deckRouter = express.Router();

deckRouter.get("/", deckController.index);
deckRouter.get("/:id", deckController.showByPk);

module.exports = deckRouter;
