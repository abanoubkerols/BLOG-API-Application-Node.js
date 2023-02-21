import { Router } from "express"
import { isLogin } from "../../middlewares/isLogin.js"
import * as commentControl from './../../controllers/comments/comment.control.js'

const commentRoute = Router()


commentRoute.post('/:id', isLogin, commentControl.createComment)

commentRoute.put('/:id', isLogin, commentControl.updateComment)

commentRoute.delete('/:id', isLogin, commentControl.deleteComment)



export default commentRoute