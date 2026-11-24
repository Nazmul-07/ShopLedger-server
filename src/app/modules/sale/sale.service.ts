import { prisma } from "../../../lib/prisma.ts";
import type { Prisma } from "@prisma/client";
import AppError from "../../../shared/AppError.ts";
import type { ISale, ISaleUpdate } from "./sale.interface.ts";

// CREATE SALE
const createSale = async (data: ISale) => {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const product = await tx.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    if (product.stock < data.quantity) {
      throw new AppError(400, "Insufficient product stock");
    }

    const totalAmount = data.quantity * data.unitPrice;

    // if (!Number.isSafeInteger(totalAmount)) {
    //   throw new AppError(400, "Sale amount is too large");
    // }

    if (data.paidAmount > totalAmount) {
      throw new AppError(
        400,
        "Paid amount cannot be greater than total amount",
      );
    }

    const stockUpdate = await tx.product.updateMany({
      where: {
        id: data.productId,
        stock: { gte: data.quantity },
      },
      data: {
        stock: { decrement: data.quantity },
      },
    });

    if (stockUpdate.count === 0) {
      throw new AppError(400, "Insufficient product stock");
    }

    return tx.sale.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        costPrice: product.costPrice,
        totalAmount,
        paidAmount: data.paidAmount,
        soldAt: data.soldAt,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  });
};

// GET ALL SALES
const getAllSales = async () => {
  return prisma.sale.findMany({
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
  });
};

// GET SINGLE SALE
const getSingleSale = async (id: string) => {
  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!sale) {
    throw new AppError(404, "Sale not found");
  }

  return sale;
};

// UPDATE SALE
const updateSale = async (id: string, data: ISaleUpdate) => {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

    // 1. Find existing sale inside transaction
    const existingSale = await tx.sale.findUnique({
      where: { id },
    });

    if (!existingSale) {
      throw new AppError(404, "Sale not found");
    }

    // 2. Calculate updated values
    const newQuantity = data.quantity ?? existingSale.quantity;
    const newUnitPrice = data.unitPrice ?? existingSale.unitPrice;
    const newPaidAmount = data.paidAmount ?? existingSale.paidAmount;

    // 3. Validate values
    if (!Number.isSafeInteger(newQuantity) || newQuantity <= 0) {
      throw new AppError(400, "Invalid quantity");
    }

    if (!Number.isSafeInteger(newUnitPrice) || newUnitPrice < 0) {
      throw new AppError(400, "Invalid unit price");
    }

    if (!Number.isSafeInteger(newPaidAmount) || newPaidAmount < 0) {
      throw new AppError(400, "Invalid paid amount");
    }

    const newTotalAmount = newQuantity * newUnitPrice;

    if (!Number.isSafeInteger(newTotalAmount)) {
      throw new AppError(400, "Sale amount is too large");
    }

    if (newPaidAmount > newTotalAmount) {
      throw new AppError(
        400,
        "Paid amount cannot be greater than total amount"
      );
    }

    // 4. Calculate quantity difference
    const quantityDifference = newQuantity - existingSale.quantity;

    // 5. Adjust stock
    if (quantityDifference > 0) {
      const stockUpdate = await tx.product.updateMany({
        where: {
          id: existingSale.productId,
          stock: { gte: quantityDifference },
        },
        data: {
          stock: { decrement: quantityDifference },
        },
      });

      if (stockUpdate.count === 0) {
        throw new AppError(400, "Insufficient product stock");
      }
    }

    if (quantityDifference < 0) {
      await tx.product.update({
        where: { id: existingSale.productId },
        data: {
          stock: { increment: Math.abs(quantityDifference) },
        },
      });
    }

    // 6. Update sale
    return tx.sale.update({
      where: { id },
      data: {
        quantity: newQuantity,
        unitPrice: newUnitPrice,
        totalAmount: newTotalAmount,
        paidAmount: newPaidAmount,
        ...(data.soldAt !== undefined && {
          soldAt: data.soldAt,
        }),
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  });
};

// DELETE SALE
const deleteSale = async (id: string) => {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const sale = await tx.sale.findUnique({
      where: { id },
    });

    if (!sale) {
      throw new AppError(404, "Sale not found");
    }

    // Restore sold quantity to product stock.
    await tx.product.update({
      where: { id: sale.productId },
      data: {
        stock: { increment: sale.quantity },
      },
    });

    return tx.sale.delete({
      where: { id },
    });
  });
};

export const SaleService = {
  createSale,
  getAllSales,
  getSingleSale,
  updateSale,
  deleteSale,
};
