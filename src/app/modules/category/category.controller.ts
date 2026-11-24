import type { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync.ts";
import { CategoryService } from "./category.service.ts";



export const createCategory = catchAsync(async (req: Request, res: Response) => {
    const data = req.body;
    const result = await CategoryService.createCategory(data);

    res.status(200).json({
        success: true,
        message: "Category create successfully",
        data: result,
    })
});

export const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.getAllCategories();
    res.status(200).json({
        success: true,
        message: "All category",
        data: result,
    })
});

export const getSingleCategory = catchAsync(async (req: Request, res: Response)=>{
    const {id} = req.params;
    const result = await CategoryService.getSingleCategory(id as string);

    res.status(200).json({
        success: true,
        message: "Category retrieved successfully",
        data: result,
    })
})

export const updateCategory = catchAsync(async (req: Request, res: Response)=>{
    const {id} = req.params
    const data = req.body;

    const result = await CategoryService.updateCategory(id as string, data)

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        date: result,
    })
})

export const deleteCategory = catchAsync(async(req: Request, res: Response)=>{
    const {id}= req.params

    const result = await CategoryService.deleteCategory(id as string);

    res.status(200).json({
        success: true,
        message: "Category deleted successfully"
    })
})