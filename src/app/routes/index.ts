import { Router } from "express";
import { categoryRouter } from "../modules/category/category.route.ts";
import { productRouter } from "../modules/product/product.route.ts";
import { salesRouter } from "../modules/sale/sale.route.ts";
import { expenseRouter } from "../modules/expense/expense.route.ts";
import { dashboardRouter } from "../modules/dashboard/dashboard.route.ts";

const router = Router();

const routes = [
    {
        path: '/categories',
        route: categoryRouter
    },
    {
        path: '/products',
        route: productRouter
    },
    {
        path: '/sales',
        route: salesRouter
    },
    {
        path: '/expenses',
        route: expenseRouter
    },
    {
        path: '/dashboard',
        route: dashboardRouter
    }
]

routes.forEach((route) =>{
    router.use(route.path, route.route)
})

export const allRoutes = router;