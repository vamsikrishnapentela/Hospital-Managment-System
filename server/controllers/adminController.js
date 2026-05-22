import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Token from '../models/Token.js';
import Prescription from '../models/Prescription.js';
import TestReport from '../models/TestReport.js';
import bcrypt from 'bcryptjs';

export const createDoctor = async (req, res) => {
  try {
    const { name, email, department, floorNumber, roomNumber } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const defaultPassword = await bcrypt.hash('password123', salt);

      user = await User.create({
        name,
        email,
        password: defaultPassword,
        role: 'doctor'
      });
    }

    const newDoctor = await Doctor.create({
      userRef: user._id,
      specialization: department,
      floorNumber: floorNumber || 1,
      roomNumber: roomNumber || '101'
    });

    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userRef', 'name email');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    await User.findByIdAndDelete(doctor.userRef);
    await Doctor.findByIdAndDelete(id);

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
