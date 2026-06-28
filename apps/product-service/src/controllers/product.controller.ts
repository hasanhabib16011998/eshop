import prisma from "@packages/libs/prisma";
import { NextFunction, Request, Response } from "express";

// get product categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch both simultaneously to optimize response time
    const [categories, subCategories] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: 'asc' }, // Optional: returns them in alphabetical order
      }),
      prisma.subcategory.findMany({
        orderBy: { name: 'asc' },
      }),
    ]);

    return res.status(200).json({
      categories,
      subCategories,
    });
  } catch (error) {
    return next(error);
  }
};