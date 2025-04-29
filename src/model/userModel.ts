import { ObjectId } from "mongoose";

export interface User {
  _id?: any; 
  name: string;
  email: string;
  role: 'admin' | 'user';
  password: string;
  verification_token?: string;
  is_verified: boolean;
}