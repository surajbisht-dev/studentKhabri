const router = require("express").Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const { getLeads, getLeadById } = require("../controllers/lead.controller");

router.get("/", requireAuth, getLeads);
router.get("/:id", requireAuth, getLeadById);

module.exports = router;
