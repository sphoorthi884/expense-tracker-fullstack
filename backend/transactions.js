const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');

router.get('/', authMiddleware, async (req, res) => {
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
    const txs = await prisma.transaction.findMany({
      where,
      orderBy: { transactionDate: 'desc' },
      include: { category: true }
    });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.id;
  const { amount, type, note, transactionDate, categoryName } = req.body;
  if (!amount || !type || !transactionDate) return res.status(400).json({ error: 'Missing fields' });

  try {
    let category = null;
    if (categoryName) {
      category = await prisma.category.findFirst({ where: { name: categoryName, userId }});
      if (!category) {
        category = await prisma.category.create({ data: { name: categoryName, userId }});
      }
    }

    const tx = await prisma.transaction.create({
      data: {
        userId,
        categoryId: category ? category.id : null,
        amount: parseFloat(amount),
        type,
        note,
        transactionDate: new Date(transactionDate)
      }
    });
    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.id;
  const id = parseInt(req.params.id, 10);
  const { amount, type, note, transactionDate, categoryName } = req.body;
  try {
    const existing = await prisma.transaction.findUnique({ where: { id }});
    if (!existing || existing.userId !== userId) return res.status(404).json({ error: 'Not found' });

    let category = null;
    if (categoryName) {
      category = await prisma.category.findFirst({ where: { name: categoryName, userId }});
      if (!category) {
        category = await prisma.category.create({ data: { name: categoryName, userId }});
      }
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        type: type || undefined,
        note: note !== undefined ? note : undefined,
        transactionDate: transactionDate ? new Date(transactionDate) : undefined,
        categoryId: category ? category.id : (categoryName === null ? null : undefined)
      }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.id;
  const id = parseInt(req.params.id, 10);
  try {
    const existing = await prisma.transaction.findUnique({ where: { id }});
    if (!existing || existing.userId !== userId) return res.status(404).json({ error: 'Not found' });

    await prisma.transaction.delete({ where: { id }});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
