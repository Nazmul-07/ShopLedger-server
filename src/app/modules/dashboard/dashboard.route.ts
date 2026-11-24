import { Router } from "express";
import { DashboardController } from "./dashboard.controller.ts";


const router = Router();

router.get("/summary", DashboardController.getDashboardSummary);

export const dashboardRouter = router;