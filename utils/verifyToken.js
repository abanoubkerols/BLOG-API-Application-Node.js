import Jwt from "jsonwebtoken"

export const verifyToken = token => {
    return Jwt.verify(token, process.env.jwt_key, (err, decoded) => {
        if (err) {
            return false
        } else {
            return decoded
        }

    })
}