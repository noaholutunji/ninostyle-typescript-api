import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import userRouter from './routers/user';
import campgroundRouter from './routers/product';
const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(campgroundRouter);

const URL: string = process.env.MONGODB_URL || '';

mongoose.connect(URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

export default app;
