import express from 'express';
import { getDoctorQueue, callToken, completeConsultation, getDoctorsList, getDoctorLabReports } from '../controllers/doctorController.js';

const router = express.Router();

router.get('/list', getDoctorsList);
router.get('/queue/:doctorId', getDoctorQueue);
router.post('/call-token', callToken);
router.post('/complete-consultation', completeConsultation);
router.get('/labs/:doctorId', getDoctorLabReports);

export default router;
