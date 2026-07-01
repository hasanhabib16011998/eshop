import { AuthError, NotFoundError, ValidationError } from "@packages/error-handler";
import { imageKitClient } from "@packages/libs/imagekit";
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

    if (isDiscountCodeExist) {
      return next(new ValidationError("Discount code already exists, please use a different code!"))
    }

    const discount_code = await prisma.discount_codes.create({
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
    const discount_codes = await prisma.discount_codes.findMany({
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
    const { id } = req.params;
    const sellerId = req.seller?.id;

    const discountCode = await prisma.discount_codes.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });

    if (!discountCode) {
      return next(new NotFoundError("Discount code not found!"))
    }

    if (discountCode.sellerId !== sellerId) {
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

//upload product picture
export const uploadProductImage = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileName } = req.body;
    const response = await imageKitClient.files.upload({
      file: fileName,
      fileName: `product-${Date.now()}.jpg`,
    });

    res.status(201).json({
      file_url: response.url,
      fileId: response.fileId,
    })
  } catch (error) {
    next(error);
  }
}

//delete product picture
export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.body;
    const response = await imageKitClient.files.delete(fileId);

    res.status(201).json({
      success: true,
      response
    })
  } catch (error) {
    next(error);
  }
}

//create product
export const createProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      slug,
      category,
      subcategory,
      short_description,
      detailed_description,
      images = [],
      video_url,
      tags,
      brand,
      colors = [],
      sizes = [],
      stock,
      sale_price,
      regular_price,
      warrenty,
      custom_specifications,
      customProperties,
      cash_on_delivery,
      discountCodes = [],
    } = req.body;

    if (
      !title ||
      !slug ||
      !short_description ||
      !detailed_description ||
      !category ||
      !subcategory ||
      !sale_price ||
      !regular_price ||
      !stock ||
      !tags
    ) {
      return next(new ValidationError("Missing Required Fields"));
    }

    if (!req.seller.id) {
      return next(new AuthError("Only seller can create products"));
    }

    const slugChecking = await prisma.products.findUnique({
      where: {
        slug,
      }
    });

    if (slugChecking) {
      return next(new ValidationError("Slug already exists! Please use a different slug!"))
    };

    const newProduct = await prisma.products.create({
      data: {
        title,
        short_description,
        detailed_description,
        warrenty,
        cashOnDelivery: cash_on_delivery,
        slug,
        shopId: req.seller?.shop?.id!,
        tags: Array.isArray(tags) ? tags : tags.split(","),
        brand,
        video_url,
        category,
        subcategory,
        colors: colors || [],
        discount_codes: discountCodes.map((codeId: string) => codeId),
        sizes: sizes || [],
        stock: parseInt(stock),
        sale_price: parseFloat(sale_price),
        regular_price: parseFloat(regular_price),
        custom_properties: customProperties || {},
        custom_specifications: custom_specifications || {},
        images: {
          create: images.filter((img: any) => img && img.fileId && img.file_url)
            .map((img: any) => ({
              file_id: img.fileId,
              url: img.file_url,
            }))
        }
      },
      include: { images: true },
    });

    res.status(201).json({
      success: true,
      newProduct,
    })
  } catch (error) {
    next(error);
  }
}

//fetch all products
export const getShopProducts = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        shopId: req?.seller?.shop?.id,
      },
      include:{
        images: true,
      }
    });

    res.status(201).json({
      success: true,
      products,
    })
  } catch (error) {
    next(error)
  }
}

//delete product
export const deleteProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: {
        id: productId
      },
      select: {
        id: true,
        shopId: true,
        isDeleted: true
      }
    });

    if(!product) {
      return next(new ValidationError("Product not found"));
    };

    if(product.shopId !== sellerId) {
      return next(new ValidationError("Unauthorized action"));
    }

    if(product.isDeleted) {
      return next(new ValidationError("Product is already deleted"));
    };

    const deletedProduct = await prisma.products.update({
      where: {
        id: productId
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now() + 24*60*60*1000),
      }
    });

    return res.status(200).json({
      message: "Product is scheduled for deletion in 24 hours. You can restore it within this period.",
      deletedAt: deletedProduct.deletedAt,
    })
  } catch (error) {
    return next(error);
  }
}

//restore product
export const restoreProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: {
        id: productId
      },
      select: {
        id: true,
        shopId: true,
        isDeleted: true
      }
    });

    if(!product) {
      return next(new ValidationError("Product not found"));
    };

    if(product.shopId !== sellerId) {
      return next(new ValidationError("Unauthorized action"));
    }

    if(!product.isDeleted) {
      return res.status(400).json({
        message: "Product is not in deleted state."
      })
    };

    await prisma.products.update({
      where: {
        id: productId
      },
      data: {
        isDeleted: false,
        deletedAt: null,
      }
    });

    return res.status(200).json({
      message: "Product is successfully restored.",
    })
  } catch (error) {
    return next(error);
  }
}