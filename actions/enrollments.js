'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new enrollment
export const createEnrollment = async (studentId, courseId) => {
  try {
    const newEnrollment = await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        progress: {}
      },
    });
    return newEnrollment;
  } catch (error) {
    console.error("Error creating enrollment:", error);
    throw new Error("Enrollment creation failed");
  } finally {
    await prisma.$disconnect();
  }
};

// Get all enrollments for a specific student
export const getEnrollmentsByStudent = async (studentId) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    return enrollments;
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    throw new Error("Failed to fetch enrollments");
  } finally {
    await prisma.$disconnect();
  }
};

export const getEnrolledStudentsByCourse = async (courseId) => {
  try {
    const enrolledStudents = await prisma.enrollment.findMany({
      where: { courseId },
      select: {
        id: true,
        courseId: true,
        studentId: true,
        createdAt: true,
        student: {
          select: {
            username: true,
          }
        }
      }
    });
    return enrolledStudents;
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    throw new Error("Failed to fetch enrolled students");
  } finally {
    await prisma.$disconnect();
  }
};

// Update an enrollment's progress
export const updateEnrollmentProgress = async (enrollmentId, data) => {
  try {
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: data
    });
    return updatedEnrollment;
  } catch (error) {
    console.error("Error updating enrollment:", error);
    throw new Error("Enrollment update failed");
  } finally {
    await prisma.$disconnect();
  }
};

// Delete an enrollment
export const deleteEnrollment = async (enrollmentId) => {
  try {
    await prisma.enrollment.delete({
      where: {
        id: enrollmentId
      }
    })
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    throw new Error("Enrollment deletion failed");
  } finally {
    await prisma.$disconnect();
  }
};


