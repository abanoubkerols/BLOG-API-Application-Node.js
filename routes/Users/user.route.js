import { Router } from "express"

import * as userControl from './../../controllers/users/user.control.js'
import { isLogin } from "../../middlewares/isLogin.js"
import { upload } from "../../config/cloudinary.js"

import { isAdmin } from "../../middlewares/isAdmin.js"



const userRoute = Router()


userRoute.post('/signup', userControl.userRegister)

userRoute.post('/login', userControl.loginUser)

userRoute.get('/profile', isLogin, userControl.userProfile)

userRoute.post('/profile-photo-upload', isLogin, upload.single("profile"), userControl.profilePhotoUpload)

userRoute.get('/profile-viewers/:id', isLogin, userControl.whoViewMyProfile)

userRoute.get('/following/:id', isLogin, userControl.following)

userRoute.get('/unfollowing/:id', isLogin, userControl.unFollowing)

userRoute.get('/block/:id', isLogin, userControl.blockUser)

userRoute.get('/unBlock/:id', isLogin, userControl.unBlockUser)

userRoute.put('/admin-block/:id', isLogin, isAdmin, userControl.adminBlockUser)

userRoute.put('/admin-unblock/:id', isLogin, isAdmin, userControl.adminUnBlockUser)

userRoute.put('/', isLogin, userControl.updateProfile)

userRoute.put('/update-password', isLogin, userControl.updatePasswordUser)

userRoute.delete('/dalete-user', isLogin, userControl.daleteUser)







export default userRoute

