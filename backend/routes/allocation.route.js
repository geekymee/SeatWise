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
      .get('/exams', getExams) 
      .get('/rooms', getRooms) 
      .post('/allocation', createAllocation) 
      .get('/getallocations', getAllocation)
      .get('/export', sendExcels);

export default router;