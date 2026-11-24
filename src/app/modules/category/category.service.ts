
import { equal } from "node:assert";
import { prisma } from "../../../lib/prisma.ts";
import AppError from "../../../shared/AppError.ts";
import type { ICategory, IUpdateCategory } from "./category.interface.ts";

const createCategory = async (data: ICategory) => {
  return prisma.category.create({
    data: {
      name: data.name,
      type: data.type
    }
  });
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return categories
};

const getSingleCategory = async(id: string) =>{
    const category = await prisma.category.findUnique({
        where: {id},
    })
    if(!category){
        throw new AppError(404, "Category not found!")
    }

    return category;
}

const updateCategory = async (id: string, data: IUpdateCategory)=>{
    await getSingleCategory(id)

    return prisma.category.update({
        where:{id},
        data,
    })
}

const deleteCategory = async (id: string)=>{
    await getSingleCategory(id)

    const [productCount, expenseCount] = await Promise.all([
        prisma.product.count({where: {categoryId: id}}),
        prisma.expense.count({where: {categoryId: id}})
    ])

    if(productCount>0 || expenseCount> 0){
        throw new AppError(409, "This category is already used. Deactivate it instead.")
    }

    return prisma.category.delete({
        where: {id},
    })
}

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory
};
