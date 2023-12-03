import express from 'express'

import * as user from '../controllers/usersController'
import { runValidation } from '../middlewares/runVaildator'
import { validateuser } from '../middlewares/validator'
import { uploadUserImg } from '../middlewares/uploadFile'
import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/auth'

const router = express.Router()

router.get('/', isLoggedIn,isAdmin,user.getAllUsers)


router.get('/:id',isLoggedIn,user.getOneUser)

router.post('/',uploadUserImg.single('image'),validateuser,runValidation,user.newUser)

router.put('/:id' , isLoggedIn,user.updateUser)

router.put("/user/ban/:id",isLoggedIn,isAdmin,user.updateBan)

router.delete("/user/delete/:id",isLoggedIn,isAdmin,user.deleteSingleUser)

router.get('/user/activate/:token',user.activateUser)

router.post('/user/forget-password',isLoggedOut,user.forgotPassword)

router.put('/user/reset-password',user.resetPassword)

router.post('/login',user.loginUser)

router.post('/logout', isLoggedIn,user.logoutUser)

export default router

