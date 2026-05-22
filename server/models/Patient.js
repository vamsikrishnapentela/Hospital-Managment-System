import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true }, // e.g. P-2024-0042
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  bloodGroup: { type: String },
  phone: { type: String, required: true },
  address: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relation: { type: String }
  },
  allergies: [{ type: String }],
  medicalHistory: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Receptionist
}, {
  timestamps: true
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
