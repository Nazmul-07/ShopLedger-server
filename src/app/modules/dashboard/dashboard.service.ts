import { prisma } from "../../../lib/prisma.ts";


const getDashboardSummary = async () => {
  const [
    totalProducts,
    totalCategories,
    salesSummary,
    expensesSummary,
    allSales,
    recentSales,
    recentExpenses,
  ] = await Promise.all([
    // Total products
    prisma.product.count(),

    // Total categories
    prisma.category.count(),

    // Sales total and paid total
    prisma.sale.aggregate({
      _sum: {
        totalAmount: true,
        paidAmount: true,
      },
    }),

    // Expenses total
    prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
    }),

    // Sales data for gross profit calculation
    prisma.sale.findMany({
      select: {
        quantity: true,
        unitPrice: true,
        costPrice: true,
      },
    }),

    // Latest 5 sales
    prisma.sale.findMany({
      take: 5,
      orderBy: {
        soldAt: "desc",
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    }),

    // Latest 5 expenses
    prisma.expense.findMany({
      take: 5,
      orderBy: {
        expenseDate: "desc",
      },
      include: {
        category: true,
      },
    }),
  ]);

  const totalSales = salesSummary._sum.totalAmount ?? 0;
  const totalPaid = salesSummary._sum.paidAmount ?? 0;
  const totalExpenses = expensesSummary._sum.amount ?? 0;

  const totalDue = totalSales - totalPaid;

  // Gross profit = (Selling price - Cost price) * Quantity
  const grossProfit = allSales.reduce((total: number, sale: { quantity: number; unitPrice: number; costPrice: number }) => {
    return total + (sale.unitPrice - sale.costPrice) * sale.quantity;
  }, 0);

  // Net profit = Gross profit - Total expenses
  const netProfit = grossProfit - totalExpenses;

  return {
    summary: {
      totalProducts,
      totalCategories,
      totalSales,
      totalPaid,
      totalDue,
      totalExpenses,
      grossProfit,
      netProfit,
    },
    recentSales,
    recentExpenses,
  };
};

export const DashboardService = {
  getDashboardSummary,
};