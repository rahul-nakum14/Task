import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import actionItemRoutes from './routes/actionItemRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', actionItemRoutes);

app.get('/', (req, res) => {
  res.send('Action Item API is running');
});

export default app;
