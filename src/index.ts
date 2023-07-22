import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import playerRoutes from './routes/playerRoute';
import playerCatRoutes from './routes/playerCatRoute';
import catDropRoutes from './routes/catDropRoute';
import itemRoutes from './routes/itemsRoute';
import authRoutes from './routes/authRoute';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', playerRoutes);
app.use('/api', playerCatRoutes);
app.use('/api', catDropRoutes);
app.use('/api', itemRoutes);
app.use('/api', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});