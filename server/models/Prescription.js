import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  patientRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true }
  }],
  diagnosis: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'dispensed'], default: 'pending' },
  issuedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
