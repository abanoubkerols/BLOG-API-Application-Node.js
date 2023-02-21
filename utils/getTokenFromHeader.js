

export const getTokenFromHeader = (req) =>{
    let {authorization} = req.headers

   let check_token = authorization.startsWith(process.env.BearerToken)
    

   
    if(!check_token){
        return false
    }else{
        const token = authorization.split(process.env.BearerToken)[1]
    
        if(token !== undefined ){
            return token
        }else{
            return false
        }
    }
   
}