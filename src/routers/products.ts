import { Router } from 'express'

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFilteredProducts,
  getSingleProduct,
  updateProduct,
} from '../controllers/productsController'
import { upload } from '../middlewares/uploadFile'

const productsRouter = Router()

//GET: /api/products' -> return all products
productsRouter.get('/', getAllProducts)

//GET: /api/products/filtered' -> return all products
productsRouter.get('/filtered', getFilteredProducts)

//GET: /api/products/:slug' -> return single product by its slug
productsRouter.get('/:slug', getSingleProduct)

//POST: /api/products' -> create new product
productsRouter.post('/', upload.single('image'), createProduct)

//DELETE: /api/products/:slug' -> delete single product by its slug
productsRouter.delete('/:slug', deleteProduct)

//PUT: /api/products/:slug' -> update single product by its slug
productsRouter.put('/:slug', updateProduct)

export default productsRouter
