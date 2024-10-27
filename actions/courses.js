'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCourse = async (course) => {
  try {
    const { title, description } = course;

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
      },
    });

    return newCourse;
  } catch (error) {
    console.error("Error creating course:", error);
    throw new Error("Course creation failed");
  } finally {
    await prisma.$disconnect();
  }
};

export const getCourses = async () => {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  } finally {
    await prisma.$disconnect();
  }
};

// Get coureses that are enrolled in by the user
export const getEnrolledCourses = async (userId) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId },
    });

    const courses = await prisma.course.findMany({
      where: { id: { in: enrollments.map(e => e.courseId) } },
    });

    return courses;
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    throw new Error("Failed to fetch enrolled courses");
  } finally {
    await prisma.$disconnect();
  }
};
