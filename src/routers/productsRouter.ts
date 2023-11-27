import { Router } from 'express'

import * as products from '../controllers/productsController'
import { upload } from '../middlewares/uploadFile'
import { validateProduct } from '../middlewares/validator'
import { runValidation } from '../middlewares/runVaildator'

const productsRouter = Router()

//GET: /api/products' -> return all products
productsRouter.get('/', products.getAllProducts)

//GET: /api/products/filtered' -> return all products
productsRouter.get('/filtered', products.getFilteredProducts)

//GET: /api/products/:slug' -> return single product by its slug
productsRouter.get('/:slug', products.getSingleProduct)

//POST: /api/products' -> create new product
productsRouter.post('/', upload.single('image'), validateProduct, runValidation, products.createProduct)

//DELETE: /api/products/:id' -> delete single product by its id
productsRouter.delete('/:id', products.deleteProduct)

//PUT: /api/products/:id' -> update single product by its id
productsRouter.put('/:id', products.updateProduct)

export default productsRouter
