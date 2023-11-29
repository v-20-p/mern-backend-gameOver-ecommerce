import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'

import { Product, ProductInterface } from '../models/productsSchema'
import ApiError from '../errors/ApiError'
import { deleteImage } from '../services/deleteImage'

const successResponse = (res: Response, statusCode = 200, message = 'Successful', payload = {}) => {
  res.status(statusCode).send({
    message,
    payload: payload,
  })
}

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //pagenation
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    //products search
    const search = (req.query.search as string) || ''
    const searchRegExp = new RegExp('.*' + search + '.*', 'i')

    //products filter
    const categoryFilter = req.query.filter || ''

    let filter = {}
    categoryFilter
      ? (filter = {
          categoryId: { $eq: categoryFilter },
          $or: [{ title: { $regex: searchRegExp } }, { description: { $regex: searchRegExp } }],
        })
      : (filter = {
          $or: [{ title: { $regex: searchRegExp } }, { description: { $regex: searchRegExp } }],
        })

    const count = await Product.countDocuments()
    if (count <= 0) {
      throw new ApiError(404, 'No products found')
    }

    const totalPages = Math.ceil(count / limit)
    if (page > totalPages) {
      page = totalPages
    }

    const skip = (page - 1) * limit

    const products: ProductInterface[] = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ price: +1 })
      .populate('categoryId')

    if (products.length === 0) {
      throw new ApiError(404, 'No products found')
    }

    res.status(200).send({
      message: 'Return all products',
      payload: {
        products,
        totalPages,
        currentPage: page,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const product = await Product.findOne({ slug })
    if (!product) {
      throw new ApiError(404, `No product found with this slug ${slug}`)
    }

    successResponse(res, 200, 'Single product is rendered', product)
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, price, description, categoryId, quantity, sold, shipping } = req.body

    const newProduct: ProductInterface = new Product({
      title,
      slug: slugify(title),
      price,
      description,
      image: req.file?.path,
      categoryId,
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
    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      throw new ApiError(404, `No product found with this id ${id}`)
    }

    if (product && product.image) {
      if (product.image !== 'public/images/productsImages/defaultProductImage.png') {
        await deleteImage(product.image)
      }
    }

    successResponse(res, 200, `Product ${id} is deleted`, product)
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body
    if (title) {
      req.body.slug = slugify(title)
    }

    const id = req.params.id
    const updatedProductData = { ...req.body, image: req.file?.path }
    console.log(updatedProductData)

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true })

    if (updatedProduct) {
      successResponse(res, 200, `Product ${id} is updated`, updatedProduct)
    } else {
      throw new ApiError(404, `No product found with this id ${IDBObjectStore}`)
    }
  } catch (error) {
    next(error)
  }
}
