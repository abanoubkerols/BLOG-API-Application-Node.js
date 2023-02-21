import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"

import { verifyToken } from "../utils/verifyToken.js";

import { AppError } from "../utils/appError.js";

export const isLogin = (req, res, next) => {
    const token = getTokenFromHeader(req)
    
    const decodedUser = verifyToken(token)

    req.userAuth = decodedUser.id

    if (!decodedUser) {
       return next(new AppError("Invalid/Expierd token, please login again"))
    }
    else {
        next()
    }


}