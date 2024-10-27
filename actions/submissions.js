'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new submission
export const createSubmission = async (submission) => {
  try {
    const { courseId, moduleId, contentId, userId, contentType, score, data } = submission;

    const newSubmission = await prisma.submission.create({
      data: {
        courseId,
        moduleId,
        contentId,
        userId,
        contentType,
        score,
        data,
      },
    });

    return newSubmission;
  } catch (error) {
    console.error("Error creating submission:", error);
    throw new Error("Submission creation failed");
  } finally {
    await prisma.$disconnect();
  }
};

// Get a single submission by ID
export const getSubmissionById = async (id) => {
  try {
    const submission = await prisma.submission.findUnique({ where: { id } });
    return submission;
  } catch (error) {
    console.error("Error fetching submission:", error);
    throw new Error("Failed to fetch submission");
  } finally {
    await prisma.$disconnect();
  }
};

// Get all submissions for a user
export const getPlainSubmissionsByUserId = async (userId) => {
  try {
    const submissions = await prisma.submission.findMany({ 
      where: { userId },
      select: {
        contentType: true,
        score: true,
        data: true,
      }
    });
    return submissions;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw new Error("Failed to fetch submissions");
  } finally {
    await prisma.$disconnect();
  }
};

// Update a submission
export const updateSubmission = async (id, updatedData) => {
  try {
    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: updatedData,
    });

    return updatedSubmission;
  } catch (error) {
    console.error("Error updating submission:", error);
    throw new Error("Submission update failed");
  } finally {
    await prisma.$disconnect();
  }
};

// Delete a submission
export const deleteSubmission = async (id) => {
  try {
    await prisma.submission.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting submission:", error);
    throw new Error("Submission deletion failed");
  } finally {
    await prisma.$disconnect();
  }
};
