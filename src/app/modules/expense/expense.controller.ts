import type { Request, Response } from "express";
import AppError from "../../../shared/AppError.ts";
import catchAsync from "../../../shared/catchAsync.ts";
import { ExpenseService } from "./expense.service.ts";


const validateObjectId = (id: string) => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new AppError(400, "Invalid MongoDB ObjectId");
  }
};

// CREATE EXPENSE
const createExpense = catchAsync(async (req: Request, res: Response) => {
  const data = req.body 
  const result = await ExpenseService.createExpense(data);

  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    data: result,
  });
});

// GET ALL EXPENSES
const getAllExpenses = catchAsync(async (req: Request, res: Response) => {
  const result = await ExpenseService.getAllExpenses();

  res.status(200).json({
    success: true,
    message: "Expenses retrieved successfully",
    data: result,
  });
});

// GET SINGLE EXPENSE
const getSingleExpense = catchAsync(async (req: Request, res: Response) => {
  validateObjectId(req.params.id as string);

  const result = await ExpenseService.getSingleExpense(req.params.id as string);

  res.status(200).json({
    success: true,
    message: "Expense retrieved successfully",
    data: result,
  });
});

// UPDATE EXPENSE
const updateExpense = catchAsync(async (req: Request, res: Response) => {
  validateObjectId(req.params.id as string);

  const data = req.body;

  const result = await ExpenseService.updateExpense(
    req.params.id as string,
    data
  );

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    data: result,
  });
});

// DELETE EXPENSE
const deleteExpense = catchAsync(async (req: Request, res: Response) => {
  validateObjectId(req.params.id as string);

  await ExpenseService.deleteExpense(req.params.id as string);

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
  });
});

export const ExpenseController = {
  createExpense,
  getAllExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
};