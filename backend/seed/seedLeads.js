require("dotenv").config();
const mongoose = require("mongoose");
const Lead = require("../models/Lead");

// copied from ChatGpt

const first = [
  "Aman",
  "Neha",
  "Rohit",
  "Priya",
  "Kunal",
  "Simran",
  "Vikas",
  "Anjali",
  "Sahil",
  "Divya",
];
const last = [
  "Sharma",
  "Verma",
  "Singh",
  "Gupta",
  "Joshi",
  "Bisht",
  "Khan",
  "Mehta",
  "Patel",
  "Yadav",
];
const companies = [
  "Pixisphere",
  "GigFlow",
  "CloudNine",
  "AlphaTech",
  "NextStack",
  "DataNest",
  "Leadify",
  "ShopZen",
];
const sources = ["website", "referral", "linkedin", "ads", "cold-email"];
const stages = ["new", "contacted", "qualified", "converted", "lost"];
const owners = ["Aman", "Neha", "Rahul", "Pooja"];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randPhone = () => "9" + Math.floor(100000000 + Math.random() * 900000000);
const randScore = () => Math.floor(10 + Math.random() * 90);

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected for seeding");

    await Lead.deleteMany({});

    const leads = [];
    for (let i = 0; i < 1000; i++) {
      const f = rand(first);
      const l = rand(last);
      const name = `${f} ${l}`;
      const company = rand(companies);
      const email = `${f.toLowerCase()}.${l.toLowerCase()}${i}@${company.toLowerCase()}.com`;

      const createdAt = new Date(
        Date.now() - Math.floor(Math.random() * 60) * 86400000
      );

      leads.push({
        name,
        email,
        phone: randPhone(),
        company,
        source: rand(sources),
        stage: rand(stages),
        owner: rand(owners),
        score: randScore(),
        lastContactedAt:
          Math.random() > 0.4
            ? new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000)
            : null,
        createdAtISO: createdAt.toISOString().slice(0, 10),
        createdAt,
        updatedAt: createdAt,
      });
    }

    await Lead.insertMany(leads);
    console.log("Seeded:", leads.length, "leads");
    process.exit(0);
  } catch (e) {
    console.error("Seed failed:", e.message);
    process.exit(1);
  }
})();
