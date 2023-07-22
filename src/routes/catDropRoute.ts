import express from 'express';
import { dropRandomCat, adoptCat } from '../controllers/catDropController';

const router = express.Router();

router.get('/dropRandomCat', dropRandomCat);
router.post('/adoptCat', adoptCat);

export default router;