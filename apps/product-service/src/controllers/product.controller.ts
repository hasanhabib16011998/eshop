import { NotFoundError, ValidationError } from "@packages/error-handler";
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

//Create Discount Codes
export const createDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { public_name, discountType, discountValue, discountCode } = req.body;

    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: {
        discountCode
      }
    })

    if(isDiscountCodeExist) {
      return next(new ValidationError("Discount code already exists, please use a different code!"))
    }

    const discount_code= await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue: parseFloat(discountValue),
        discountCode,
        sellerId: req.seller.id
      }
    });

    res.status(201).json({
      success: true,
      discount_code,
    });
  } catch (error) {
    next(error);
  }

}

//Get Discount Codes
export const getDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const discount_codes= await prisma.discount_codes.findMany({
      where: {
        sellerId: req.seller.id,
      }
    });

    res.status(201).json({
      success: true,
      discount_codes,
    });
  } catch (error) {
    next(error);
  }

}

//Delete discount codes
export const deleteDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id} = req.params;
    const sellerId = req.seller?.id;

    const discountCode = await prisma.discount_codes.findUnique({
      where: {id},
      select: { id: true, sellerId: true },
    });

    if(!discountCode) {
      return next(new NotFoundError("Discount code not found!"))
    }

    if(discountCode.sellerId !== sellerId) {
      return next(new ValidationError("Unauthorized access!"))
    }

    await prisma.discount_codes.delete({
      where: { id }
    });

    return res.status(200).json({
      message: "Discount code successfully deleted"
    });
  } catch (error) {
    next(error);
  }

}