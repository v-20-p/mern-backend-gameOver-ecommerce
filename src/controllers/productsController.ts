import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'

import {
  deleteProductBySlug,
  filterProductsByPrice,
  findAllProducts,
  findProductBySlug,
} from '../services/productsServices'
import { Product, ProductInterface } from '../models/productSchema'
import { createError } from '../utility/createError'

const successResponse = (res: Response, statusCode = 200, message = 'successful', payload = {}) => {
  //payload refers to the data we send (the name can be anything)
  res.status(statusCode).send({
    message,
    payload: payload,
  })
}

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page)
    const limit = Number(req.query.limit)

    const { products, totalPages, currentPage } = await findAllProducts(page, limit)

    res.send({
      message: 'Return all products',
      payload: {
        products,
        totalPages,
        currentPage,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getFilteredProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page)
    const limit = Number(req.query.limit)

    const { products } = await filterProductsByPrice(page, limit)

    successResponse(res, 200, 'Return filtered products', products)
  } catch (error) {
    next(error)
  }
}

export const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const product = await findProductBySlug(slug)

    successResponse(res, 200, 'Single product is rendered', product)
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, description, quantity, sold, shipping } = req.body

    const productExist = await Product.exists({ name })
    if (!productExist) {
      const newProduct: ProductInterface = new Product({
        name,
        slug: slugify(name),
        price,
        description,
        image: req.file?.path,
        quantity,
        sold,
        shipping,
      }) //create and push new product to mongodb
      await newProduct.save()

      successResponse(res, 201, 'New product is created', newProduct)
    } else {
      const error = createError(404, 'This product is already exist')
      throw error
    }
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug
    const product = await deleteProductBySlug(slug)

    successResponse(res, 200, `Product ${slug} is deleted`, product)
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body
    if (name) {
      req.body.slug = slugify(name)
    }

    const slug = req.params.slug
    const updatedProductData = req.body
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      updatedProductData,
      { new: true }
    )
    if (updatedProduct) {
      successResponse(res, 200, `Product ${slug} is updated`, updatedProduct)
    } else {
      throw new Error(`No product found with this slug ${slug}`)
    }
  } catch (error) {
    next(error)
  }
}
