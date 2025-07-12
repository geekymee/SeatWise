import express from 'express';
import handleNewUser from '../controllers/register.controller.js'
const router = express.Router();

router.post('/', handleNewUser);

export default router;