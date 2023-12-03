import { Category } from '../models/categorySchema'
import express from 'express'
import {
  createCategory,
  deletCategoryBySlug,
  getAllCategories,
  updateCategoryBySlug,
} from '../controllers/categoriesController'

const router = express.Router()

router.get('/', getAllCategories)
router.post('/', createCategory)
router.put('/:slug', updateCategoryBySlug)
router.delete('/:slug', deletCategoryBySlug)

export default router
