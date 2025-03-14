import express from 'express';
import { clerkWebHook } from '../controllers/webhookController';
import bodyParser from 'body-parser';

const router = express.Router();

// Route for Clerk webhook
router.post(
  '/clerk',
  bodyParser.raw({ type: 'application/json' }),
  clerkWebHook,
);

export default router;
