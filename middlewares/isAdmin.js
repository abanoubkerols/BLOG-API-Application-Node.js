import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"

import { verifyToken } from "../utils/verifyToken.js";

import { AppError } from "../utils/appError.js";

import { userModel } from "../models/User/User.model.js";

export const isAdmin = async (req, res, next) => {
    const token = getTokenFromHeader(req)
    
    const decodedUser = verifyToken(token)

    req.userAuth = decodedUser.id

    const user = await userModel.findById(decodedUser.id)
    
    if(user.isAdmin){
        return next()
    }else{
        return next(new AppError("Access Denied, admin only " ,403))

    }


}