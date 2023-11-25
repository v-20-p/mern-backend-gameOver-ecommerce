import { Category } from './../models/category'
import express from 'express'
import {
  createCategory,
  deletCategoryBySlug,
  getAllCategories,
  updateCategoryBySlug,
} from '../controllers/categoryController'

const router = express.Router()

router.get('/', getAllCategories)
router.post('/', createCategory)
router.put('/:slug', updateCategoryBySlug)
router.delete('/:slug', deletCategoryBySlug)

export default router
