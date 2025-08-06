import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import router from './routes';
import { specs } from './swagger';

dotenv.config();

const app = express();


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'DELETE','PATCH','PUT'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(router);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});