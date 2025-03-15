import { Request, Response } from 'express';
import Comment from '../models/commentModel';
import User from '../models/userModel';

// Define custom request with auth property
interface AuthRequest extends Request {
  auth?: {
    userId: string;
    sessionClaims?: {
      metadata?: {
        role?: string;
      };
    };
  };
}

// Get comments for a specific post
export const getPostComments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'username img clerkUserId')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
};

// Add a new comment
export const addComment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const clerkUserId = req.auth?.userId;
    const postId = req.params.postId;

    if (!clerkUserId) {
      res.status(401).json({ message: 'Not authenticated!' });
      return;
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const newComment = new Comment({
      desc: req.body.desc, // Changed from spread operator to match your model
      user: user._id,
      post: postId,
    });

    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};

// Delete a comment
export const deleteComment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const clerkUserId = req.auth?.userId;
    const id = req.params.id;

    if (!clerkUserId) {
      res.status(401).json({ message: 'Not authenticated!' });
      return;
    }

    const role = req.auth?.sessionClaims?.metadata?.role || 'user';

    // If admin, delete directly
    if (role === 'admin') {
      await Comment.findByIdAndDelete(id);
      res.status(200).json({ message: 'Comment has been deleted' });
      return;
    }

    // For regular users, find their ID first
    const user = await User.findOne({ clerkUserId });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const deletedComment = await Comment.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!deletedComment) {
      res.status(403).json({ message: 'You can delete only your comment!' });
      return;
    }

    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};
