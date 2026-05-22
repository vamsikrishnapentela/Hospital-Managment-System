import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  qualifications: [{ type: String }],
  experience: { type: Number },
  consultationFee: { type: Number },
  availableDays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
  availableSlots: [{ type: String }],
  floorNumber: { type: Number, required: true },
  roomNumber: { type: String, required: true },
  rating: { type: Number, default: 0 },
  bio: { type: String },
  photo: { type: String }
}, {
  timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
