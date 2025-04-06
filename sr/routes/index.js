const express = require("express");
const {
  createAccount,
  login,
  authenticate,
} = require("../controllers/accountController");

const router = express.Router();

router.post("/login", login);

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/calculations', calculationRoutes);

module.exports = router;
