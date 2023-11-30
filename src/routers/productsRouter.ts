import { Router } from 'express'

import * as products from '../controllers/productController'
import { uploadProductImg } from '../middlewares/uploadFile'
import { validateCreateProduct, validateUpdateProduct } from '../middlewares/validator'
import { runValidation } from '../middlewares/runVaildator'
import { isAdmin, isLoggedIn } from '../middlewares/auth'

const productsRouter = Router()

productsRouter.get('/', products.getAllProducts)

productsRouter.get('/:slug', products.getSingleProductBySlug)

productsRouter.post(
  '/',
  isLoggedIn,
  isAdmin,
  uploadProductImg.single('image'),
  validateCreateProduct,
  runValidation,
  products.createProduct
)

productsRouter.delete('/:id', isLoggedIn, isAdmin, products.deleteProduct)

productsRouter.put(
  '/:id',
  isLoggedIn,
  isAdmin,
  uploadProductImg.single('image'),
  validateUpdateProduct,
  runValidation,
  products.updateProduct
)

export default productsRouter
