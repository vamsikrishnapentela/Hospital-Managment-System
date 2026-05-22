import Patient from '../models/Patient.js';
import Token from '../models/Token.js';
import Doctor from '../models/Doctor.js';
import Prescription from '../models/Prescription.js';
import TestReport from '../models/TestReport.js';

// @desc    Register a new patient
// @route   POST /api/reception/register-patient
// @access  Private (Receptionist)
export const registerPatient = async (req, res) => {
  try {
    const { name, dob, gender, bloodGroup, phone, address, emergencyContact, allergies } = req.body;
    
    // Generate a unique patient ID (e.g., P-2026-XXXX)
    const year = new Date().getFullYear();
    const count = await Patient.countDocuments();
    const patientId = `P-${year}-${String(count + 1).padStart(4, '0')}`;

    const newPatient = await Patient.create({
      patientId,
      name,
      dob,
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
      allergies
      // createdBy: req.user._id // would come from auth middleware
    });

    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate a token for a patient to see a doctor
// @route   POST /api/reception/generate-token
// @access  Private (Receptionist)
export const generateToken = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({ message: 'Patient or Doctor not found' });
    }

    // Generate daily sequential code
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const countToday = await Token.countDocuments({
      doctorRef: doctorId,
      createdAt: { $gte: today }
    });

    const code = `${countToday + 101}`; // starts at 101

    const newToken = await Token.create({
      code,
      patientRef: patientId,
      doctorRef: doctorId,
      floorNumber: doctor.floorNumber,
      roomNumber: doctor.roomNumber,
      status: 'waiting-for-nurse'
    });

    // We will emit socket event here soon to update displays

    res.status(201).json(newToken);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active token queue
// @route   GET /api/reception/queue
// @access  Private
export const getActiveQueue = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tokens = await Token.find({
      createdAt: { $gte: today },
      status: { $in: ['waiting', 'waiting-for-nurse', 'waiting-for-doctor', 'called', 'in-progress'] }
    })
    .populate('patientRef', 'name patientId')
    .populate('doctorRef', 'userRef')
    .populate({
      path: 'doctorRef',
      populate: { path: 'userRef', select: 'name' }
    })
    .sort({ createdAt: 1 });

    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/reception/doctors
// @access  Private
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userRef', 'name email');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search patients
// @route   GET /api/reception/patients
// @access  Private
export const searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    let filter = {};
    if (query) {
      filter = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { phone: { $regex: query, $options: 'i' } },
          { patientId: { $regex: query, $options: 'i' } }
        ]
      };
    }
    const patients = await Patient.find(filter).sort({ createdAt: -1 }).limit(20);
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient complete history
// @route   GET /api/reception/patient/:id/history
// @access  Private
export const getPatientHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const tokens = await Token.find({ patientRef: id }).populate({ path: 'doctorRef', populate: { path: 'userRef' } }).sort({ createdAt: -1 });
    const prescriptions = await Prescription.find({ patientRef: id }).populate({ path: 'doctorRef', populate: { path: 'userRef' } }).sort({ issuedAt: -1 });
    const labTests = await TestReport.find({ patientRef: id }).populate({ path: 'doctorRef', populate: { path: 'userRef' } }).sort({ requestedAt: -1 });

    res.status(200).json({
      patient,
      tokens,
      prescriptions,
      labTests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
