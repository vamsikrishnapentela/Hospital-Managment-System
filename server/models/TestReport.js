import mongoose from 'mongoose';

const testReportSchema = new mongoose.Schema({
  patientRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  labTechRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The user who uploaded the report
  testType: { type: String, required: true },
  reportFile: { type: String }, // Cloudinary URL
  reportNotes: { type: String },
  status: { type: String, enum: ['pending', 'uploaded'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  uploadedAt: { type: Date }
}, {
  timestamps: true
});

const TestReport = mongoose.model('TestReport', testReportSchema);
export default TestReport;
