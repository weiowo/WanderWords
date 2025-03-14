import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  deletePost,
  // uploadAuth,
  featurePost,
} from '../controllers/postController';
import increaseVisit from '../middlewares/increaseVisit';
import Post from '../models/postModel';

const router = express.Router();

// router.get("/upload-auth", uploadAuth);
router.get('/', getPosts);
router.get('/:slug', increaseVisit, getPost);
router.post('/', createPost);
router.delete('/:id', deletePost);
router.patch('/feature', featurePost);

router.get('/', async (req, res) => {
  const posts = await Post.find();
  res.status(200).send(posts);
});

export default router;
