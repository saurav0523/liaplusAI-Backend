import { Router } from 'express';
import { login, signup, verifyEmail } from './controllers/authController';
import { getPosts, createPost, deletePost, updatePost } from './controllers/postController';
import {  restrictToAdmin, requireVerification, authenticateToken } from './middlewares/authMiddleware';

const router = Router();

router.post('/auth/signup', signup);
router.get('/auth/verify', verifyEmail);
router.post('/auth/login', login);

router.get('/posts', authenticateToken, requireVerification, getPosts);
router.post('/posts', authenticateToken, restrictToAdmin, requireVerification, createPost);
router.delete('/posts/:id', authenticateToken, restrictToAdmin, requireVerification, deletePost);
router.put('/posts/:id', authenticateToken, restrictToAdmin, requireVerification, updatePost)
export default router;