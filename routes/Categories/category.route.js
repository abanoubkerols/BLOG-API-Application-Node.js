import { Router } from "express"
import { isLogin } from "../../middlewares/isLogin.js"
import * as catControl from './../../controllers/categories/category.control.js'
const categoryRoute = Router()


categoryRoute.post("/", isLogin, catControl.createCategory)

categoryRoute.get("/", isLogin, catControl.fetchCategories)

categoryRoute.get("/:id", isLogin, catControl.oneCategory);

categoryRoute.put("/:id", isLogin, catControl.updateCategory);

categoryRoute.delete("/:id", isLogin, catControl.deleteCategory);




export default categoryRoute