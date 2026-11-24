import type { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync.ts";
import { DashboardService } from "./dashboard.service.ts";


const getDashboardSummary = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DashboardService.getDashboardSummary();

    res.status(200).json({
      success: true,
      message: "Dashboard summary retrieved successfully",
      data: result,
    });
  }
);

export const DashboardController = {
  getDashboardSummary,
};