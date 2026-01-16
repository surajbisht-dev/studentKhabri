const router = require("express").Router();
const { login, logout } = require("../controllers/auth.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
