const Lead = require("../models/Lead");

// GET /api/leads (search, filter, sort, paginate) + metrics api here
async function getLeads(req, res) {
  const {
    search = "",
    stage,
    source,
    owner,
    minScore,
    maxScore,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = "1",
    limit = "10",
  } = req.query;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const query = {};

  if (search.trim()) {
    const s = search.trim();
    query.$or = [
      { name: { $regex: s, $options: "i" } },
      { email: { $regex: s, $options: "i" } },
      { company: { $regex: s, $options: "i" } },
      { phone: { $regex: s, $options: "i" } },
    ];
  }

  if (stage) query.stage = stage;
  if (source) query.source = source;
  if (owner) query.owner = owner;

  if (minScore || maxScore) {
    query.score = {};
    if (minScore) query.score.$gte = Number(minScore);
    if (maxScore) query.score.$lte = Number(maxScore);
  }

  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [items, total] = await Promise.all([
    Lead.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    Lead.countDocuments(query),
  ]);

  const [totalLeads, convertedLeads, byStage] = await Promise.all([
    Lead.countDocuments({}),
    Lead.countDocuments({ stage: "converted" }),
    Lead.aggregate([
      { $group: { _id: "$stage", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.json({
    items,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
    metrics: {
      totalLeads,
      convertedLeads,
      byStage,
    },
  });
}

// GET /api/leads/:id  api here
async function getLeadById(req, res) {
  const lead = await Lead.findById(req.params.id).lean();
  if (!lead) return res.status(404).json({ message: "Lead not found" });
  res.json({ lead });
}

module.exports = { getLeads, getLeadById };
