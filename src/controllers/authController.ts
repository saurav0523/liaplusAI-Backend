import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/db';
import { sendVerificationEmail } from '../services/emailService';
import { User } from '../model/userModel';
// import { User } from '../models/user.model';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = Math.random().toString(36).substring(2, 15);

  try {
    const database = await db;
    const user: User = {
      name,
      email,
      role: role || 'user',
      password: hashedPassword,
      verification_token: verificationToken,
      is_verified: false,
    };

    const userFind = await database.collection('users').findOne({email});
    if(userFind){
      res.status(400).json({message:'User already exists'});
      return;
    }
    const result = await database.collection('users').insertOne(user);
    const insertedUser = { ...user, _id: result.insertedId };

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'User created, please verify your email', user: insertedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query;

  try {
    const database = await db;
    const result = await database.collection('users').findOneAndUpdate(
      { verification_token: token as string },
      { $set: { is_verified: true }, $unset: { verification_token: "" } }
    );
    if (!result) {
      res.status(400).json({ message: 'Invalid or expired verification token' });
      return;
    }
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const database = await db;
    const user = await database.collection('users').findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (!user.is_verified) {
      res.status(403).json({ message: 'Please verify your email first' });
      return;
    }

    const token = jwt.sign(
      { id: user._id?.toString(), role: user.role, is_verified: user.is_verified }, // Convert ObjectId to string
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};