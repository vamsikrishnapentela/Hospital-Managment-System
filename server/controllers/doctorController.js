import Token from '../models/Token.js';
import Doctor from '../models/Doctor.js';
import Prescription from '../models/Prescription.js';
import TestReport from '../models/TestReport.js';

export const getDoctorsList = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userRef', 'name email');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorQueue = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tokens = await Token.find({
      doctorRef: doctorId,
      createdAt: { $gte: today },
      status: { $in: ['waiting-for-doctor', 'called', 'in-progress', 'done'] }
    })
    .populate('patientRef')
    .sort({ createdAt: 1 });

    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const callToken = async (req, res) => {
  try {
    const { tokenId } = req.body;
    
    const token = await Token.findByIdAndUpdate(
      tokenId,
      { 
        status: 'called', 
        calledAt: new Date() 
      },
      { new: true }
    ).populate('patientRef').populate({ path: 'doctorRef', populate: { path: 'userRef' } });

    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeConsultation = async (req, res) => {
  try {
    const { tokenId, diagnosis, medicines, labTests } = req.body;

    const token = await Token.findById(tokenId);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    token.status = 'done';
    await token.save();

    // Create Prescription if medicines exist
    if (medicines && medicines.length > 0) {
      await Prescription.create({
        patientRef: token.patientRef,
        doctorRef: token.doctorRef,
        medicines,
        diagnosis,
        status: 'pending'
      });
    }

    // Create Lab Tests if requested
    if (labTests && labTests.length > 0) {
      for (const test of labTests) {
        await TestReport.create({
          patientRef: token.patientRef,
          doctorRef: token.doctorRef,
          testType: test,
          status: 'pending'
        });
      }
    }

    res.status(200).json({ message: 'Consultation completed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorLabReports = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const reports = await TestReport.find({ doctorRef: doctorId })
      .populate('patientRef')
      .sort({ requestedAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
