import { Request, Response } from 'express';
import User from '../models/userModel';
import Post from '../models/postModel';
import Comment from '../models/commentModel';
import { Webhook } from 'svix';
import { Types } from 'mongoose';

// Define the Clerk webhook event types
interface ClerkEmailAddress {
  email_address: string;
  id: string;
  verification: {
    status: string;
    strategy: string;
  };
}

interface ClerkUserData {
  id: string;
  username?: string;
  email_addresses: ClerkEmailAddress[];
  profile_img_url?: string;
}

interface ClerkEvent {
  type: string;
  data: ClerkUserData;
}

export const clerkWebHook = async (
  req: Request,
  res: Response,
): Promise<any> => {
  console.log('here');
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    console.log('hey', WEBHOOK_SECRET);

    if (!WEBHOOK_SECRET) {
      throw new Error('Webhook secret needed!');
    }

    const payload = req.body;
    const headers = req.headers;
    const svixHeaders = {
      'svix-id': headers['svix-id'] as string,
      'svix-timestamp': headers['svix-timestamp'] as string,
      'svix-signature': headers['svix-signature'] as string,
    };

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: ClerkEvent;
    console.log('hey2', WEBHOOK_SECRET);
    console.log('hey3', wh);

    try {
      evt = wh.verify(JSON.stringify(payload), svixHeaders) as ClerkEvent;
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return res.status(400).json({
        message: 'Webhook verification failed!',
      });
    }

    console.log('user data', evt);

    // Handle user creation
    if (evt.type === 'user.created') {
      console.log('create');
      const newUser = new User({
        clerkUserId: evt.data.id,
        username:
          evt.data.username || evt.data.email_addresses[0]?.email_address,
        email: evt.data.email_addresses[0]?.email_address,
        img: evt.data.profile_img_url,
      });
      console.log('created');
      await newUser.save();
    }

    //Handle user deletion
    if (evt.type === 'user.deleted') {
      const deletedUser = await User.findOneAndDelete({
        clerkUserId: evt.data.id,
      });

      if (deletedUser) {
        await Post.deleteMany({ user: deletedUser._id });
        await Comment.deleteMany({ user: deletedUser._id });
      }
    }

    return res.status(200).json({
      message: 'Webhook received',
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({
      message: 'Error processing webhook',
      error: (error as Error).message,
    });
  }
};
