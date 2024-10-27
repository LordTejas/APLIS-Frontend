'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createModule = async (module) => {
  try {
    const { title, courseId, description } = module;

    const newModule = await prisma.module.create({
      data: {
        title,
        courseId,
        description,
      },
    });

    return newModule;
  } catch (error) {
    console.error("Error creating module:", error);
    throw new Error("Module creation failed");
  } finally {
    await prisma.$disconnect();
  }
};

export const getModules = async (courseId) => {
  try {
    const modules = await prisma.module.findMany({
      where: { courseId },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return modules;
  } catch (error) {
    console.error("Error fetching modules:", error);
    throw new Error("Failed to fetch modules");
  } finally {
    await prisma.$disconnect();
  }
};

export const updateModule = async (id, updatedData) => {
  try {
    const updatedModule = await prisma.module.update({
      where: { id },
      data: updatedData,
    });

    return updatedModule;
  } catch (error) {
    console.error("Error updating module:", error);
    throw new Error("Module update failed");
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteModule = async (id) => {
  try {
    await prisma.module.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting module:", error);
    throw new Error("Module deletion failed");
  } finally {
    await prisma.$disconnect();
  }
};

export const createModuleContent = async (courseId, moduleId, contentData) => {
  try {
    const newContent = await prisma.moduleContent.create({
      data: {
        courseId,
        moduleId,
        ...contentData,
      },
    });
    return newContent;
  } catch (error) {
    console.error("Error creating module content:", error);
    throw new Error("Module content creation failed");
  } finally {
    await prisma.$disconnect();
  }
};

export const getModuleContents = async (courseId, moduleId) => {
  try {
    const contents = await prisma.moduleContent.findMany({
      where: { courseId, moduleId },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return contents;
  } catch (error) {
    console.error("Error fetching module contents:", error);
    throw new Error("Failed to fetch module contents");
  } finally {
    await prisma.$disconnect();
  }
};

export const getModuleContent = async (id) => {
  try {
    const content = await prisma.moduleContent.findUnique({ where: { id } });
    return content;
  } catch (error) {
    console.error("Error fetching module content:", error);
    throw new Error("Failed to fetch module content");
  } finally {
    await prisma.$disconnect();
  }
};

export const updateModuleContent = async (id, updatedData) => {
  try {
    const updatedContent = await prisma.moduleContent.update({
      where: { id },
      data: updatedData,
    });
    return updatedContent;
  } catch (error) {
    console.error("Error updating module content:", error);
    throw new Error("Module content update failed");
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteModuleContent = async (id) => {
  try {
    await prisma.moduleContent.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting module content:", error);
    throw new Error("Module content deletion failed");
  } finally {
    await prisma.$disconnect();
  }
};
