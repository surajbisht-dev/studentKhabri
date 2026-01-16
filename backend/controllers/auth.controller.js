const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email & password required" });

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail)
    return res.status(401).json({ message: "Invalid credentials" });

  const hash = await bcrypt.hash(adminPassword, 10);
  const ok = await bcrypt.compare(password, hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  res.json({ message: "Logged in", user: { email, role: "admin" } });
}

function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}

module.exports = { login, logout };
