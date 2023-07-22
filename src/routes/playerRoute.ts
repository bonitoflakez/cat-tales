import express from 'express';
import { getPlayerProfile } from '../controllers/playerController';

const router = express.Router();

router.get('/player/:playerId', getPlayerProfile);

export default router;