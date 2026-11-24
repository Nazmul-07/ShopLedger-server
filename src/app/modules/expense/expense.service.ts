import { prisma } from "../../../lib/prisma.ts";
import AppError from "../../../shared/AppError.ts";
import type { CreateExpenseInput, UpdateExpenseInput } from "./expense.interface.ts";



// VALIDATE EXPENSE CATEGORY
const validateExpenseCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  if (!category.isActive) {
    throw new AppError(400, "This category is inactive");
  }

  if (category.type !== "EXPENSE" && category.type !== "BOTH") {
    throw new AppError(
      400,
      "This category cannot be used for expenses"
    );
  }

  return category;
};

// CREATE EXPENSE
const createExpense = async (data: CreateExpenseInput) => {
  await validateExpenseCategory(data.categoryId);

  return prisma.expense.create({
    data,
    include: {
      category: true,
    },
  });
};

// GET ALL EXPENSES
const getAllExpenses = async () => {
  return prisma.expense.findMany({
    orderBy: {
      expenseDate: "desc",
    },
    include: {
      category: true,
    },
  });
};

// GET SINGLE EXPENSE
const getSingleExpense = async (id: string) => {
  const expense = await prisma.expense.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!expense) {
    throw new AppError(404, "Expense not found");
  }

  return expense;
};

// UPDATE EXPENSE
const updateExpense = async (
  id: string,
  data: UpdateExpenseInput
) => {
  await getSingleExpense(id);

  if (data.categoryId) {
    await validateExpenseCategory(data.categoryId);
  }

  return prisma.expense.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

// DELETE EXPENSE
const deleteExpense = async (id: string) => {
  await getSingleExpense(id);

  return prisma.expense.delete({
    where: { id },
  });
};

export const ExpenseService = {
  createExpense,
  getAllExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
};