import express from 'express';
import { searchTokens, updateVitals, getPendingPatients } from '../controllers/nurseController.js';

const router = express.Router();

router.get('/pending', getPendingPatients);
router.get('/search', searchTokens);
router.post('/vitals', updateVitals);

export default router;
