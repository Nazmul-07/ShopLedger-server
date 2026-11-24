import { Router } from "express";
import { SaleController } from "./sale.controller.ts";


const router = Router();

router.post("/", SaleController.createSale);
router.get("/", SaleController.getAllSales);
router.get("/:id", SaleController.getSingleSale);
router.patch("/:id", SaleController.updateSale);
router.delete("/:id", SaleController.deleteSale);

export const salesRouter = router;