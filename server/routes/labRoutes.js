import express from 'express';
import { getPendingTests, uploadTestResult } from '../controllers/labController.js';

const router = express.Router();

router.get('/pending', getPendingTests);
router.post('/upload', uploadTestResult);

export default router;
