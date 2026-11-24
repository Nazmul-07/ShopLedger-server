
import type { Request, Response } from "express";
import AppError from "../../../shared/AppError.ts";
import catchAsync from "../../../shared/catchAsync.ts";
import { SaleService } from "./sale.service.ts";

const validateObjectId = (id: string) => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new AppError(400, "Invalid MongoDB ObjectId");
  }
};

// CREATE SALE
const createSale = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  validateObjectId(data.productId);

  const result = await SaleService.createSale(data);

  res.status(201).json({
    success: true,
    message: "Sale created successfully",
    data: result,
  });
});

// GET ALL SALES
const getAllSales = catchAsync(async (req: Request, res: Response) => {
  const result = await SaleService.getAllSales();

  res.status(200).json({
    success: true,
    message: "Sales retrieved successfully",
    data: result,
  });
});

// GET SINGLE SALE
const getSingleSale = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  validateObjectId(id);

  const result = await SaleService.getSingleSale(id);

  res.status(200).json({
    success: true,
    message: "Sale retrieved successfully",
    data: result,
  });
});

// UPDATE SALE
const updateSale = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = req.body;

  validateObjectId(id);

  const result = await SaleService.updateSale(id, data);

  res.status(200).json({
    success: true,
    message: "Sale updated successfully",
    data: result,
  });
});

// DELETE SALE
const deleteSale = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  validateObjectId(id);

  await SaleService.deleteSale(id);

  res.status(200).json({
    success: true,
    message: "Sale deleted successfully",
  });
});

export const SaleController = {
  createSale,
  getAllSales,
  getSingleSale,
  updateSale,
  deleteSale,
};
