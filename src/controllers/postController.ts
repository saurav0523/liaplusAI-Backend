import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import db from '../database/db';
import { Post } from '../model/postModel';


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