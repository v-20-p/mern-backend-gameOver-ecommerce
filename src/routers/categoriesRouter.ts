import { Category } from '../models/categorySchema'
import express from 'express'
import {
  createCategory,
  deletCategoryBySlug,
  getAllCategories,
  updateCategoryBySlug,
} from '../controllers/categoriesController'
import { validateCategory } from '../middlewares/validator'
import { runValidation } from '../middlewares/runVaildator'

const router = express.Router()

router.get('/', getAllCategories)
router.post('/', createCategory, validateCategory, runValidation)
router.put('/:slug', updateCategoryBySlug, validateCategory, runValidation)
router.delete('/:slug', deletCategoryBySlug, validateCategory, runValidation)

export default router
