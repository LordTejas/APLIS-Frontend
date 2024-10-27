'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new quiz
export const createQuiz = async (quiz) => {
  try {
    const { title, courseId, moduleId, questions, dueDate, points } = quiz;

    const newQuiz = await prisma.quiz.create({
      data: {
        title,
        courseId,
        questions,
        dueDate,
        points,
        ...(moduleId && { moduleId }),
      },
    });

    return newQuiz;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw new Error("Quiz creation failed");
  } finally {
    await prisma.$disconnect();
  }
};

// Get a single quiz by ID
export const getQuizById = async (id) => {
  try {
    const quiz = await prisma.quiz.findUnique({ where: { id } });
    return quiz;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw new Error("Failed to fetch quiz");
  } finally {
    await prisma.$disconnect();
  }
};

// Get all quizzes for a specific course
export const getQuizzesByCourse = async (courseId) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { courseId },
    });

    return quizzes;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw new Error("Failed to fetch quizzes");
  } finally {
    await prisma.$disconnect();
  }
};

// Get all quizzes for a specific course and module
export const getQuizzesByCourseModule = async (courseId, moduleId) => {
  try {
    const quizzes = await prisma.quiz.findMany({ where: { courseId, moduleId } });
    return quizzes;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw new Error("Failed to fetch quizzes");
  } finally {
    await prisma.$disconnect();
  }
};

// Update a quiz
export const updateQuiz = async (id, updatedData) => {
  try {
    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: updatedData,
    });

    return updatedQuiz;
  } catch (error) {
    console.error("Error updating quiz:", error);
    throw new Error("Quiz update failed");
  } finally {
    await prisma.$disconnect();
  }
};

// Delete a quiz
export const deleteQuiz = async (id) => {
  try {
    await prisma.quiz.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw new Error("Quiz deletion failed");
  } finally {
    await prisma.$disconnect();
  }
};

