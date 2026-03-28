import mongoose from 'mongoose';

const goalSchema = mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: '#3b82f6' },
  userId: { type: String }
}, {
  timestamps: true
});

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
