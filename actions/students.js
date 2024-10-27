'use server'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getStudents() {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw new Error("Failed to fetch students");
  } finally {
    await prisma.$disconnect();
  }
}

export async function getStudentsIdAndUsername() {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
      select: {
        id: true,
        username: true,
      },
    });

    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw new Error("Failed to fetch students");
  } finally {
    await prisma.$disconnect();
  }
}

