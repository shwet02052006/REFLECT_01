import express from 'express';
import Goal from '../models/Goal.js';

const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      const goals = await Goal.find(userId ? { userId } : {});
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const { name, color } = req.body;
      const userId = req.headers['x-user-id'];
      const goal = new Goal({ name, color, userId });
      const createdGoal = await goal.save();
      res.status(201).json(createdGoal);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

export default router;
