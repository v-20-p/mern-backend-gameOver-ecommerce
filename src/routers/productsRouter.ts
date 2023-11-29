import { Router } from 'express'

import * as products from '../controllers/productsController'
import { uploadProductImg } from '../middlewares/uploadFile'
import { validateCreateProduct, validateUpdateProduct } from '../middlewares/validator'
import { runValidation } from '../middlewares/runVaildator'
import { isAdmin, isLoggedIn } from '../middlewares/auth'

const productsRouter = Router()

productsRouter.get('/', products.getAllProducts)

productsRouter.get('/:slug', products.getSingleProductBySlug)

productsRouter.post('/', uploadProductImg.single('image'), isLoggedIn, validateCreateProduct, runValidation, products.createProduct)

productsRouter.delete('/:id', isLoggedIn, products.deleteProduct)

productsRouter.put('/:id', uploadProductImg.single('image'), isLoggedIn, validateUpdateProduct, runValidation, products.updateProduct)

export default productsRouter
