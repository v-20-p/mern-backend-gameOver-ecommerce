import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'

import * as service from '../services/productsServices'
import { Product, ProductInterface } from '../models/productsSchema'
import ApiError from '../errors/ApiError'
import { ProductInput } from '../types'

const successResponse = (res: Response, statusCode = 200, message = 'successful', payload = {}) => {
  res.status(statusCode).send({
    message,
    payload: payload,
  })
}

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page)
    const limit = Number(req.query.limit)

    const { products, totalPages, currentPage } = await service.findAllProducts(page, limit)

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

    const { products } = await service.filterProductsByPrice(page, limit)

    successResponse(res, 200, 'Return filtered products', products)
  } catch (error) {
    next(error)
  }
}

export const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const product = await service.findProductBySlug(slug)

    successResponse(res, 200, 'Single product is rendered', product)
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, description, quantity, sold, shipping } = req.body

    const newProduct: ProductInterface = new Product({
      name,
      slug: slugify(name),
      price,
      description,
      image: req.file?.path,
      quantity,
      sold,
      shipping,
    })
    await newProduct.save()

    successResponse(res, 201, 'New product is created', newProduct)
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const product = await service.deleteProductById(id)

    if (!product) {
      throw new ApiError(404, 'No product found with this id')
    }

    successResponse(res, 200, `Product ${id} is deleted`, product)
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

    const id = req.params.id
    const updatedProductData: ProductInput = req.body
    const updatedProduct = await Product.findByIdAndUpdate(
      { id },
      updatedProductData,
      { new: true }
    )
    
    if (updatedProduct) {
      successResponse(res, 200, `Product ${id} is updated`, updatedProduct)
    } else {
      throw new ApiError(404, `No product found with this id ${id}`)
    }
  } catch (error) {
    next(error)
  }
}
