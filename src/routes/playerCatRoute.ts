import express from 'express';
import { getCatDetails } from '../controllers/catController';

const router = express.Router();

router.get('/playerCat/:catOwnerId', getCatDetails);

export default router;