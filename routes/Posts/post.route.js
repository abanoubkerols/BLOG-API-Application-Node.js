import { Router } from "express"
import * as postControl from './../../controllers/posts/post.control.js'
import { isLogin } from "../../middlewares/isLogin.js"
import multer from "multer"
import { upload } from "../../config/cloudinary.js"


const postRoute = Router()


postRoute.post("/" , isLogin ,upload.single("iamge"),postControl.createPost) 

postRoute.get("/" , isLogin ,postControl.AllPosts) 

postRoute.get("/likes/:id" , isLogin ,postControl.LikesPostToggle) 

postRoute.get("/dislikes/:id" , isLogin ,postControl.DisLikesPostToggle) 

postRoute.get("/:id" , isLogin ,postControl.postDetailsView) 

postRoute.delete("/:id" , isLogin ,postControl.deletePost) 

postRoute.put("/:id" , isLogin , upload.single("iamge") ,postControl.updatePost) 



export default postRoute