const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');

router.get('/', authMiddleware, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.id;
  try {
    const cats = await prisma.category.findMany({ where: { userId }, orderBy: { name: 'asc' }});
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.id;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  try {
    // avoid duplicates
    const existing = await prisma.category.findFirst({ where: { name, userId }});
    if (existing) return res.status(400).json({ error: 'Category already exists' });
    const cat = await prisma.category.create({ data: { name, userId }});
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.id;
  const id = parseInt(req.params.id,10);
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  try {
    const existing = await prisma.category.findUnique({ where: { id }});
    if (!existing || existing.userId !== userId) return res.status(404).json({ error: 'Not found' });
    const updated = await prisma.category.update({ where: { id }, data: { name }});
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.id;
  const id = parseInt(req.params.id,10);
  try {
    const existing = await prisma.category.findUnique({ where: { id }});
    if (!existing || existing.userId !== userId) return res.status(404).json({ error: 'Not found' });

    await prisma.transaction.updateMany({ where: { categoryId: id }, data: { categoryId: null } });

    await prisma.category.delete({ where: { id }});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
