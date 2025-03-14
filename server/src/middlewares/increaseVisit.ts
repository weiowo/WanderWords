import { Request, Response, NextFunction } from 'express';
// import Post from "../models/postModel";
import Post from '../models/postModel';

/**
 * Middleware to increase the visit count for a post
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const increaseVisit = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const slug = req.params.slug;

    if (!slug) {
      next();
      return;
    }

    await Post.findOneAndUpdate({ slug }, { $inc: { visit: 1 } });

    next();
  } catch (error) {
    console.error('Error increasing visit count:', error);
    // Continue to the next middleware even if there's an error
    // to avoid breaking the request flow
    next();
  }
};

export default increaseVisit;
