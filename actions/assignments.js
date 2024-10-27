'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new assignment
export const createAssignment = async (assignment) => {
  try {
    const { title, courseId, moduleId, description, dueDate, points } = assignment;

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        courseId,
        moduleId,
        description,
        dueDate,
        points,
      },
    });

    return newAssignment;
  } catch (error) {
    console.error("Error creating assignment:", error);
    throw new Error("Assignment creation failed");
  } finally {
    await prisma.$disconnect();
  }
};

// Get all assignments for a specific course
export const getAssignmentsByCourse = async (courseId) => {
  try {
    const assignments = await prisma.assignment.findMany({
      where: { courseId },
    });

    return assignments;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    throw new Error("Failed to fetch assignments");
  } finally {
    await prisma.$disconnect();
  }
};

// Get a single assignment by ID
export const getAssignmentById = async (id) => {
  try {
    const assignment = await prisma.assignment.findUnique({ where: { id } });
    return assignment;
  } catch (error) {
    console.error("Error fetching assignment:", error);
    throw new Error("Failed to fetch assignment");
  } finally {
    await prisma.$disconnect();
  }
};

// Get all assignments for a specific course and module
export const getAssignmentsByCourseModule = async (courseId, moduleId) => {
  try {
    const assignments = await prisma.assignment.findMany({ where: { courseId, moduleId } });
    return assignments;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    throw new Error("Failed to fetch assignments");
  } finally {
    await prisma.$disconnect();
  }
};

// Update an assignment
export const updateAssignment = async (id, updatedData) => {
  try {
    const updatedAssignment = await prisma.assignment.update({
      where: { id },
      data: updatedData,
    });

    return updatedAssignment;
  } catch (error) {
    console.error("Error updating assignment:", error);
    throw new Error("Assignment update failed");
  } finally {
    await prisma.$disconnect();
  }
};

// Delete an assignment
export const deleteAssignment = async (id) => {
  try {
    await prisma.assignment.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    throw new Error("Assignment deletion failed");
  } finally {
    await prisma.$disconnect();
  }
};
