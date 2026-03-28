import express from 'express';
import Entry from '../models/Entry.js';

const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    try {
      const { date } = req.query; // YYYY-MM-DD
      const userId = req.headers['x-user-id'];
      const filter = userId ? { userId } : {};
      if (date) filter.date = date;
      const entries = await Entry.find(filter).populate('goalId', 'name color').sort({ createdAt: -1 });
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const { title, duration, goalId, date } = req.body;
      const userId = req.headers['x-user-id'];
      const entry = new Entry({ title, duration, goalId, date, userId });
      const createdEntry = await entry.save();
      const populatedEntry = await Entry.findById(createdEntry._id).populate('goalId', 'name color');
      res.status(201).json(populatedEntry);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

router.route('/overview')
  .get(async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      const filter = userId ? { userId } : {};
      const entries = await Entry.find(filter).populate('goalId', 'name color');
      const stats = {};
      entries.forEach(entry => {
        if (!entry.goalId) return;
        const gId = entry.goalId._id.toString();
        if (!stats[gId]) {
          stats[gId] = { goal: entry.goalId, totalTime: 0, entriesCount: 0, recentEntries: [] };
        }
        stats[gId].totalTime += entry.duration;
        stats[gId].entriesCount += 1;
        stats[gId].recentEntries.push(entry);
      });
      // Sort recent entries per goal
      Object.keys(stats).forEach(k => {
        stats[k].recentEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        stats[k].recentEntries = stats[k].recentEntries.slice(0, 5); // keep 5 recent
      });
      res.json(Object.values(stats));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
