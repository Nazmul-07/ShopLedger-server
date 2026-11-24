import { Router } from "express"
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from "./category.controller.ts";

const router = Router();

router.post('/', createCategory)
router.get('/', getAllCategories )
router.get('/:id', getSingleCategory)
router.patch('/:id', updateCategory)
router.delete('/:id', deleteCategory)


export const categoryRouter = router;
