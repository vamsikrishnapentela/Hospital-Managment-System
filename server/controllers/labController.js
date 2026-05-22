import TestReport from '../models/TestReport.js';

export const getPendingTests = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tests = await TestReport.find({ requestedAt: { $gte: today } })
      .populate('patientRef')
      .populate({ path: 'doctorRef', populate: { path: 'userRef' } })
      .sort({ requestedAt: -1 });
    
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadTestResult = async (req, res) => {
  try {
    const { testId, reportNotes } = req.body;
    
    const test = await TestReport.findByIdAndUpdate(
      testId,
      {
        reportNotes,
        status: 'uploaded',
        uploadedAt: new Date()
      },
      { new: true }
    );

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
