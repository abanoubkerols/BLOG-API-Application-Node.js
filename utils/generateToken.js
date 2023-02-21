import  Jwt  from "jsonwebtoken";

export const generateToken = (id)=>{
    return Jwt.sign({id} , process.env.Jwt_key , {expiresIn: '7d'})
}

