import express from 'express';
import { createDoctor, getDoctors, deleteDoctor, getDashboardStats, updateSettings, getSettings } from '../controllers/adminController.js';

const router = express.Router();

router.get('/doctors', getDoctors);
router.post('/doctor', createDoctor);
router.delete('/doctor/:id', deleteDoctor);

router.get('/dashboard-stats', getDashboardStats);
router.get('/settings', getSettings);
router.post('/settings', updateSettings);

export default router;
