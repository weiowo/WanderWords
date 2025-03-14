import { Request, Response } from 'express';
// import ImageKit from "imagekit";
import Post from '../models/postModel';
import User from '../models/userModel';
import { SortOrder } from 'mongoose';

interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    sessionClaims?: {
      metadata?: {
        role?: string;
      };
    };
  };
}

export const getPosts = async (req: Request, res: Response): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 2;

    const query: any = {};
    if (req.query.cat) query.category = req.query.cat;
    if (req.query.search)
      query.title = { $regex: req.query.search, $options: 'i' };
    if (req.query.author) {
      const user = await User.findOne({ username: req.query.author }).select(
        '_id',
      );
      if (!user) return res.status(404).json('No post found!');
      query.user = user._id;
    }

    let sortObj: Record<string, SortOrder> = { createdAt: -1 };
    if (req.query.sort === 'oldest') sortObj = { createdAt: 1 };
    if (req.query.sort === 'popular') sortObj = { visit: -1 };
    if (req.query.sort === 'trending') {
      sortObj = { visit: -1 };
      query.createdAt = {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      };
    }

    if (req.query.featured === 'true') query.isFeatured = true;

    const posts = await Post.find(query)
      .populate('user', 'username')
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit);
    const totalPosts = await Post.countDocuments();
    const hasMore = page * limit < totalPosts;

    res.status(200).json({ posts, hasMore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      'user',
      'username img',
    );
    if (!post) return res.status(404).json('Post not found!');
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPost = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<any> => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return res.status(401).json('Not authenticated!');

    const user = await User.findOne({ clerkUserId });
    if (!user) return res.status(404).json('User not found!');

    let slug = req.body.title.replace(/ /g, '-').toLowerCase();
    let existingPost = await Post.findOne({ slug });
    let counter = 2;

    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }

    const newPost = new Post({ user: user._id, slug, ...req.body });
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<any> => {
  try {
    console.log('req', req);
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return res.status(401).json('Not authenticated!');

    const role = req.auth.sessionClaims?.metadata?.role || 'user';
    if (role === 'admin') {
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json('Post has been deleted');
    }

    const user = await User.findOne({ clerkUserId });
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      user: user?._id,
    });
    if (!deletedPost)
      return res.status(403).json('You can delete only your posts!');

    res.status(200).json('Post has been deleted');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const featurePost = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<any> => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return res.status(401).json('Not authenticated!');

    const role = req.auth.sessionClaims?.metadata?.role || 'user';
    if (role !== 'admin')
      return res.status(403).json('You cannot feature posts!');

    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json('Post not found!');

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { isFeatured: !post.isFeatured },
      { new: true },
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const imagekit = new ImageKit({
//   urlEndpoint: process.env.IK_URL_ENDPOINT!,
//   publicKey: process.env.IK_PUBLIC_KEY!,
//   privateKey: process.env.IK_PRIVATE_KEY!,
// });

// export const uploadAuth = async (_req: Request, res: Response) => {
//   try {
//     const result = imagekit.getAuthenticationParameters();
//     res.send(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
