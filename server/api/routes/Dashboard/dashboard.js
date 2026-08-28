const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { getDashboard } = require("../../controller/Dashboard/dashboard");

router.use(protect);
router.get("/", getDashboard);

module.exports = router;