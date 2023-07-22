import express from 'express';
import { login, signUp } from '../controllers/userAuth';

const router = express.Router();

router.post('/auth/login', login);
router.post('/auth/signup', signUp);

export default router;