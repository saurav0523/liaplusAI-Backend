import { ObjectId } from "mongoose";

export interface Post {
  _id?: any; 
  title: string;
  content: string;
  author_id: any;
  created_at: Date;
  updatedAt?: Date;
}