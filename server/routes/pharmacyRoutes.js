import express from 'express';
import { getPendingPrescriptions, dispensePrescription } from '../controllers/pharmacyController.js';

const router = express.Router();

router.get('/pending', getPendingPrescriptions);
router.post('/dispense', dispensePrescription);

export default router;
