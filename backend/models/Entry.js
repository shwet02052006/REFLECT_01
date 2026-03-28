import mongoose from 'mongoose';

const entrySchema = mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  date: { type: String, required: true },
  userId: { type: String }
}, {
  timestamps: true
});

const Entry = mongoose.model('Entry', entrySchema);
export default Entry;
