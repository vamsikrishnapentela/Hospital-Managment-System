import Prescription from '../models/Prescription.js';

export const getPendingPrescriptions = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prescriptions = await Prescription.find({ issuedAt: { $gte: today } })
      .populate('patientRef')
      .populate({ path: 'doctorRef', populate: { path: 'userRef' } })
      .sort({ issuedAt: 1 });
    
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const dispensePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.body;
    
    const prescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      { status: 'dispensed' },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
