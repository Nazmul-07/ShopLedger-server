import { Router } from "express";
import { ExpenseController } from "./expense.controller.ts";

const router = Router();

router.post("/", ExpenseController.createExpense);
router.get("/", ExpenseController.getAllExpenses);
router.get("/:id", ExpenseController.getSingleExpense);
router.patch("/:id", ExpenseController.updateExpense);
router.delete("/:id", ExpenseController.deleteExpense);

export const expenseRouter = router;