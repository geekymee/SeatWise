import express from 'express';
import {handleRoom, getRooms, deleteRooms} from '../controllers/room.controller.js';
const router = express.Router();


router.post('/', handleRoom);

router.get('/', getRooms);

router.delete('/:id', deleteRooms);

export default router;