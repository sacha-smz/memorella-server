const express = require("express");

const uploadMiddleware = require("../../middlewares/upload");
const validator = require("../../middlewares/validator");

const deckSchema = require("../../schemas/deck-schema");
const deckController = require("../../controllers/deck-controller");

const deckRouter = express.Router();

deckRouter.post("/", uploadMiddleware("cards"), validator(deckSchema), deckController.createOne);
deckRouter.patch("/:id", uploadMiddleware("cards"), deckController.editByPk);

module.exports = deckRouter;
