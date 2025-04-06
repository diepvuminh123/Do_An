const express = require("express");
const {
  createAccount,
  login,
  authenticate,
} = require("../controller/accountController");

const router = express.Router();

router.post("/login", login);

module.exports = router;
