const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');

// GET /api/analytics/sum-by-category?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/sum-by-category', authMiddleware, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.id;
  const { from, to } = req.query;

  const where = { userId };
  if (from || to) {
    where.transactionDate = {};
    if (from) where.transactionDate.gte = new Date(from);
    if (to) where.transactionDate.lte = new Date(to);
  }

  try {
    const groups = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where,
      _sum: { amount: true }
    });

    const results = await Promise.all(groups.map(async g => {
      let name = 'Uncategorized';
      if (g.categoryId) {
        const cat = await prisma.category.findUnique({ where: { id: g.categoryId }});
        if (cat) name = cat.name;
      }
      return { categoryId: g.categoryId, category: name, total: g._sum.amount || 0 };
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/monthly-summary', authMiddleware, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.id;
  const year = parseInt(req.query.year || (new Date()).getFullYear(), 10);

  const start = new Date(`${year}-01-01T00:00:00Z`);
  const end = new Date(`${year}-12-31T23:59:59Z`);

  try {
    const txs = await prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: {
          gte: start,
          lte: end
        }
      },
      select: {
        amount: true,
        transactionDate: true
      }
    });

    const months = Array.from({length:12}, (_,i) => ({ month: i+1, total: 0 }));
    txs.forEach(t => {
      const d = new Date(t.transactionDate);
      const m = d.getUTCMonth(); // 0..11
      months[m].total += Number(t.amount || 0);
    });

    res.json(months.map(m => ({ month: m.month, total: Number(m.total.toFixed(2)) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
