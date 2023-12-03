import { Router } from 'express'

import * as products from '../controllers/productsController'
import { isAdmin, isLoggedIn } from '../middlewares/auth'
import { runValidation } from '../middlewares/runVaildator'
import { uploadProductImg } from '../middlewares/uploadFile'
import { validateCreateProduct, validateDiscount, validateUpdateProduct } from '../middlewares/validator'

const productsRouter = Router()

productsRouter.get('/', products.getAllProducts)

productsRouter.get('/discount', products.getDiscountedProducts)

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
  '/update-product-info/:id',
  isLoggedIn,
  isAdmin,
  uploadProductImg.single('image'),
  validateUpdateProduct,
  runValidation,
  products.updateProduct
)

productsRouter.put(
  '/update-product-discount/:id',
  isLoggedIn,
  isAdmin,
  validateDiscount,
  runValidation,
  products.updateProductDiscount
)

export default productsRouter
