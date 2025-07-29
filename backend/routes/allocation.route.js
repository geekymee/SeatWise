import express from 'express';
import {getDates,
      getExams,
      getRooms,
      createAllocation,
      getAllocation,
      sendExcels} 
      from '../controllers/allocation.controller.js'
const router = express.Router();

router.get('/dates', getDates)
      .get('/get-exams', getExams) 
      .get('/get-rooms', getRooms) 
      .post('/allocation', createAllocation) 
      .get('/get-allocation', getAllocation)
      .get('/send-excels', sendExcels);

export default router;