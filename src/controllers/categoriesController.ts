import { Category, categorySchema } from '../models/categorySchema'
import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'
import { createHttpError } from '../util/creatHttpError'

//git
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find()
    res.send({
      message: 'get all categories',
      payload: categories,
    })
  } catch (error) {
    next(error)
  }
}

//post
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body

    const categoryExist = await Category.exists({ title: title })
    if (categoryExist) {
      const error = createHttpError(409, 'Category alrady exist with this title')
      throw error
    }
    const newCategory = new Category({
      title: title,
      slug: slugify(title),
    })

    await newCategory.save()
    res.status(201).send({ message: 'category is created' })
  } catch (error) {
    next(error)
  }
}

//delet
export const deletCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findOneAndDelete({ slug: req.params.slug })
    if (!category) {
      const error = createHttpError(404, 'Category not found with this slug')
      throw error
    }
    res.send({ message: 'deleted a single category ', payload: category })
  } catch (error) {
    next(error)
  }
}

//put
export const updateCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const category = await Category.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
    })

    if (!category) {
      throw new Error('Category not found with this slug')
    }
    res.send({ message: 'update a single category ', payload: category })
  } catch (error) {
    next(error)
  }
}
