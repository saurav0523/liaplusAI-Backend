import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import db from '../database/db';
import { Post } from '../model/postModel';
// import { Post } from '../models/post.model';


export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const database = await db;
    const posts = await database.collection('blog_posts').find().toArray();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const { title, content } = req.body;
  const author_id = new ObjectId((req as any).user.id); // Convert string to ObjectId

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

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const database = await db;
    const result = await database.collection('blog_posts').deleteOne({ _id: new ObjectId(id) }); // Convert string to ObjectId
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};