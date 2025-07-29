import express from 'express';
import fileUpload from 'express-fileupload';
import { fileExists } from '../middlewares/fileexists.js';
import { extensionLimiter } from '../middlewares/extensionlimiter.js';
import { sizeLimiter } from '../middlewares/sizelimiter.js';
import {
  addSchedule,
  uploadFile,
  viewSchedules,
  deleteSchedule
} from '../controllers/schedule.controller.js';
const router = express.Router();

router
      .post('/', addSchedule)
      .post('/file-upload', fileUpload({ createParentPath: true }),
        fileExists,
        extensionLimiter(['.xlsx']),
        sizeLimiter,
        uploadFile)
      .get('/schedule', viewSchedules)
      .delete('/:id', deleteSchedule);

export default router;