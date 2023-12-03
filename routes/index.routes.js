const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const getOneTimeProjectCode = require("../utils/getOneTimeProjectCode");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post("/project-code", isAuthenticated, async (req, res, next) => {
  const code = getOneTimeProjectCode(req.body.date);
  res.json(code);
});

module.exports = router;
