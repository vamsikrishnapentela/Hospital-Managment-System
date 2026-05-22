import express from 'express';
import { createDoctor, getDoctors, deleteDoctor } from '../controllers/adminController.js';

const router = express.Router();

router.get('/doctors', getDoctors);
router.post('/doctor', createDoctor);
router.delete('/doctor/:id', deleteDoctor);

export default router;
