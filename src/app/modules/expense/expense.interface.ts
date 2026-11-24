export interface CreateExpenseInput {
  categoryId: string;
  title: string;
  amount: number;
  description?: string;
  expenseDate?: Date;
}

export interface UpdateExpenseInput {
  categoryId?: string;
  title?: string;
  amount?: number;
  description?: string | null;
  expenseDate?: Date;
}
