'use server'

// import { customAlphabet } from 'nanoid';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a secure secret

export const createUser = async (email, username, password) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password, // Make sure to hash the password before storing it
      },
    });

    console.log("[NEW USER] ", newUser);

    // Generate JWT token
    const authToken = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    // Create session token
    const sessionToken = { id: user.id, username: user.username, email: user.email };

    // Set cookies
    const cookieStore = await cookies()

    cookieStore.set('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    cookieStore.set('session_token', JSON.stringify(sessionToken), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return newUser; // Return the authToken
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("User creation failed");
  } finally {
    await prisma.$disconnect();
  }
};

export const getUserByEmailAndPassword = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || user.password !== password) {
      throw new Error("Invalid Credentials");
    }

    // Generate JWT token
    const authToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Create session token
    const sessionToken = { id: user.id, username: user.username, email: user.email };

    // Set cookies
    const cookieStore = await cookies();

    cookieStore.set('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    cookieStore.set('session_token', JSON.stringify(sessionToken), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return { user, authToken };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User retrieval failed");
  } finally {
    await prisma.$disconnect();
  }
};
