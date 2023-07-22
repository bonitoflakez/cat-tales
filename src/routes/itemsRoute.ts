import express from 'express';
import { dropRandomItem, addDropItemToInventory } from '../controllers/itemDrop';

const router = express.Router();

router.get('/dropRandomItem', dropRandomItem);
router.post('/addItemToInv', addDropItemToInventory);

export default router;