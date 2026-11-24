import type { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync.ts";
import { ProductService } from "./product.service.ts";

// CREATE
const createProduct = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ProductService.createProduct(data);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

// GET ALL
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAllProducts();

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    ...result,
  });
});

// GET SINGLE
const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.getSingleProduct(id as string);

  res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

// UPDATE
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const result = await ProductService.updateProduct(id as string, data);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

// DELETE
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ProductService.deleteProduct(id as string);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
