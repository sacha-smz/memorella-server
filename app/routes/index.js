const express = require("express");
const router = express.Router();

router.get("/", (_, res) => {
  res.json({ data: "Welcome to Memorella API" });
});

module.exports = router;
