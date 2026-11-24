import { prisma } from "../../../lib/prisma.ts";
import AppError from "../../../shared/AppError.ts";
import type { IProduct, IProductUpdate } from "./product.interface.ts";

const validateCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  if (!category.isActive) {
    throw new AppError(400, "This category is inactive");
  }

  if (category.type !== "PRODUCT" && category.type !== "BOTH") {
    throw new AppError(
      400,
      "This category cannot be used for products"
    );
  }

  return category;
};

//Create product
const createProduct = async (data: IProduct) => {
  await validateCategory(data.categoryId);

  return prisma.product.create({
    data: {
      name: data.name,
      categoryId: data.categoryId,
      costPrice: data.costPrice,
      sellingPrice: data.sellingPrice,
      stock: data.stock,
    },
    include: {
      category: true,
    },
  });
};

// Get all product
const getAllProducts = async () => {
  
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    })

    return products;
}

// GET SINGLE PRODUCT
const getSingleProduct = async (id: string) => {

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  return product;
};

// UPDATE PRODUCT
const updateProduct = async (
  id: string,
  data: IProductUpdate
) => {
  await getSingleProduct(id);

  if (data.categoryId) {
    await validateCategory(data.categoryId);
  }

  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

// DELETE PRODUCT
const deleteProduct = async (id: string) => {
  await getSingleProduct(id);

  const saleCount = await prisma.sale.count({
    where: {
      productId: id,
    },
  });

  if (saleCount > 0) {
    throw new AppError(
      409,
      "This product has sales history and cannot be deleted"
    );
  }

  return prisma.product.delete({
    where: { id },
  });
};


export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
