require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes.js");
const leadRoutes = require("./routes/lead.routes.js");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

app.get("/", (req, res) =>
  res.json({ ok: true, service: "Lead Dashboard API" })
);

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

const PORT = process.env.PORT || 8080;

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`API running on :${PORT}`));
})();
