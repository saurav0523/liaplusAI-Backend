import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import db from '../database/db';
import { Post } from '../model/postModel';


/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Email not verified
 *       500:
 *         description: Internal server error
 */
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const database = await db;
    const posts = await database.collection('blog_posts').find().toArray();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required or email not verified
 *       500:
 *         description: Internal server error
 */
export const createPost = async (req: Request, res: Response): Promise<void> => {
  const { title, content } = req.body;
  const author_id = new ObjectId((req as any).user.id); 

  try {
    const database = await db;
    const post: Post = {
      title,
      content,
      author_id,
      created_at: new Date(),
    };
    const result = await database.collection('blog_posts').insertOne(post);
    res.status(201).json({ ...post, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post deleted"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required or email not verified
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post not found"
 *       500:
 *         description: Internal server error
 */
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const database = await db;
    const result = await database.collection('blog_posts').deleteOne({ _id: new ObjectId(id) }); 
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Update a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully updated"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request - Invalid data or no fields provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Title is required and must be a non-empty string"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required or email not verified
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post not found"
 *       500:
 *         description: Internal server error
 */
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (title && ( typeof title !== 'string' || title.trim() === '')) {
    res.status(400).json({ message: 'Title is required and must be a non-empty string' });
    return;
  }
  if (content && ( typeof content !== 'string' || content.trim() === '')) {
    res.status(400).json({ message: 'Content is required and must be a non-empty string' });
    return;
  }

  if(!title && !content){
    res.status(400).json({message: 'At least one field (title or content) must be provided'});
    return;
  }

  try {
    const database = await db;

    const updateFields: { [key:string]:any} = {updatedAt: new Date() };
    if(title) updateFields.title = title.trim();
    if (content) updateFields.content = content.trim();
    const updatedPost = await database.collection('blog_posts').findOneAndUpdate(
      { _id: new ObjectId(id) }, 
      { $set: updateFields }, 
      { returnDocument: 'after' } 
    );

    if (!updatedPost ) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.status(200).json({
      message:'Successfully updated',
      post: updatedPost.value
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
};