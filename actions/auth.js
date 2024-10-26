'use server'

// import { customAlphabet } from 'nanoid';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'
import { createSession, decrypt, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

export const createUser = async (email, username, password, role) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password, // Make sure to hash the password before storing it
        role
      },
    });

    console.log("[NEW USER] ", newUser);

    // Generate JWT token
    const authToken = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    // Set cookies
    const cookieStore = await cookies()

    cookieStore.set('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Create session
    await createSession(newUser);
    
    return newUser; // Return the authToken
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("User creation failed");
  } finally {
    await prisma.$disconnect();
  }
};

export const getUserByEmailAndPassword = async (email, password, role) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
        role: role
      },
    });

    if (!user || user.password !== password) {
      throw new Error("Invalid Credentials");
    }

    // Generate JWT token
    const authToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Set cookies
    const cookieStore = await cookies();

    cookieStore.set('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Create session token
    await createSession(user);

    return user;

  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User retrieval failed");
  } finally {
    await prisma.$disconnect();
  }
};

export const getSession = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
      return null;
    }

    const session = await decrypt(token);

    console.log("[SESSION] ", session);

    return session;

  } catch (error) {
    console.error("Error fetching session:", error);
  }
}

export async function logout() {
  await deleteSession()
  redirect('/signin')
}
