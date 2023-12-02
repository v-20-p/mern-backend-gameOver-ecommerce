import { Category } from './../models/category'
import express from 'express'
import {
  createCategory,
  deletCategoryBySlug,
  getAllCategories,
  updateCategoryBySlug,
} from '../controllers/categoryController'
import { validateCategory } from '../middlewares/validator'
import { runValidation } from '../middlewares/runVaildator'

const router = express.Router()

router.get('/', getAllCategories)
router.post('/', createCategory, validateCategory, runValidation)
router.put('/:slug', updateCategoryBySlug, validateCategory, runValidation)
router.delete('/:slug', deletCategoryBySlug, validateCategory, runValidation)

export default router
