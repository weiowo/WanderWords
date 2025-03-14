import { Request, Response } from 'express';
import User from '../models/userModel';

// Define custom request with auth property
interface AuthRequest extends Request {
  auth?: {
    userId: string;
  };
}

// Interface for saved posts request body
interface SavePostRequestBody {
  postId: string;
}

/**
 * Get all saved posts for the current user
 */
export const getUserSavedPosts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const clerkUserId = req.auth?.userId;

    if (!clerkUserId) {
      res.status(401).json({ message: 'Not authenticated!' });
      return;
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user.savedPosts);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching saved posts',
      error: (error as Error).message,
    });
  }
};

/**
 * Save or unsave a post for the current user
 */
export const savePost = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const clerkUserId = req.auth?.userId;
    const { postId } = req.body as SavePostRequestBody;

    if (!clerkUserId) {
      res.status(401).json({ message: 'Not authenticated!' });
      return;
    }

    if (!postId) {
      res.status(400).json({ message: 'Post ID is required' });
      return;
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if post is already saved
    const isSaved = user.savedPosts.some((p) => p.toString() === postId);

    if (!isSaved) {
      // Save the post
      await User.findByIdAndUpdate(user._id, {
        $push: { savedPosts: postId },
      });
    } else {
      // Unsave the post
      await User.findByIdAndUpdate(user._id, {
        $pull: { savedPosts: postId },
      });
    }

    res.status(200).json({
      message: isSaved ? 'Post unsaved' : 'Post saved',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error saving/unsaving post',
      error: (error as Error).message,
    });
  }
};
