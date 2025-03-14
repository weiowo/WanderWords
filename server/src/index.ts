import express, { Request, Response, NextFunction } from 'express';
import connectDB from './lib/connectDB';
import userRouter from './routes/userRoute';
import postRouter from './routes/postRoute';
import commentRouter from './routes/commentRoute';
import webhookRouter from './routes/webhookRoute';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//   })
// );

app.use(express.json());
app.use(clerkMiddleware());
console.log('ya');
app.use('/webhooks', webhookRouter);
console.log('test');

// app.get("/auth-state", (req:any, res) => {
//   const authState = req.auth;
//   res.json(authState)
// })

app.get('/protect', (req: any, res: any) => {
  const { userId } = req.auth;
  if (!userId) {
    return res.status(401).json('not authorized!');
  }
  res.status(200).json('content');
});

// Middleware to set response headers
// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// Define routes
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

// Global error handling middleware
app.use(
  (
    error: { status?: number; message?: string; stack?: string },
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    res.status(error.status || 500).json({
      message: error.message || 'Something went wrong!',
      status: error.status || 500,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  },
);

// Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   connectDB();
//   console.log(`Server is running on port ${PORT}`);
// });

app.listen(3002, () => {
  connectDB();
  console.log(`Server is running on 3002`);
});
