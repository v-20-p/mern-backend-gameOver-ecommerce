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
import { isAdmin, isLoggedIn } from '../middlewares/auth'

const router = express.Router()

router.get('/', getAllCategories)
router.post('/', isLoggedIn,isAdmin ,createCategory, validateCategory, runValidation)
router.put('/:slug',isLoggedIn,isAdmin , updateCategoryBySlug, validateCategory, runValidation)
router.delete('/:slug',isLoggedIn,isAdmin , deletCategoryBySlug, validateCategory, runValidation)

export default router
