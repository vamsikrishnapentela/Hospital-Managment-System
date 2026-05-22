import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  code: { type: String, required: true }, // e.g. "101"
  patientRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  floorNumber: { type: Number, required: true },
  roomNumber: { type: String, required: true },
  vitals: {
    temperature: { type: String },
    bloodPressure: { type: String },
    heartRate: { type: String },
    weight: { type: String },
    height: { type: String },
    notes: { type: String }
  },
  status: { 
    type: String, 
    enum: ['waiting', 'waiting-for-nurse', 'waiting-for-doctor', 'called', 'in-progress', 'done', 'skipped'], 
    default: 'waiting-for-nurse' 
  },
  calledAt: { type: Date }
}, {
  timestamps: true
});

const Token = mongoose.model('Token', tokenSchema);
export default Token;
