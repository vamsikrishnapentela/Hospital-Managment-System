import express from 'express';
import { registerPatient, generateToken, getActiveQueue, getDoctors, searchPatients, getPatientHistory } from '../controllers/receptionController.js';

const router = express.Router();

// Base route: /api/reception
router.post('/register-patient', registerPatient);
router.post('/generate-token', generateToken);
router.get('/queue', getActiveQueue);
router.get('/doctors', getDoctors);
router.get('/patients', searchPatients);
router.get('/patient/:id/history', getPatientHistory);

export default router;
