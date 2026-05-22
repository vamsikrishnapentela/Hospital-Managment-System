import Token from '../models/Token.js';
import Patient from '../models/Patient.js';

export const getPendingPatients = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tokens = await Token.find({
      createdAt: { $gte: today },
      status: { $in: ['waiting-for-nurse', 'waiting-for-doctor', 'called', 'in-progress', 'done'] }
    }).populate('patientRef').populate({ path: 'doctorRef', populate: { path: 'userRef' } });

    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchTokens = async (req, res) => {
  try {
    const { query } = req.query;
    
    // Search in Patient for name matching
    const patients = await Patient.find({
      name: { $regex: query, $options: 'i' }
    });
    
    const patientIds = patients.map(p => p._id);

    // Find Tokens matching either the code or the patient reference
    // We only want active tokens for the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tokens = await Token.find({
      createdAt: { $gte: today },
      status: 'waiting-for-nurse',
      $or: [
        { code: { $regex: query, $options: 'i' } },
        { patientRef: { $in: patientIds } }
      ]
    }).populate('patientRef').populate({ path: 'doctorRef', populate: { path: 'userRef' } });

    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVitals = async (req, res) => {
  try {
    const { tokenId, vitals } = req.body;
    
    const token = await Token.findByIdAndUpdate(
      tokenId,
      { 
        vitals,
        status: 'waiting-for-doctor' 
      },
      { new: true }
    );

    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
