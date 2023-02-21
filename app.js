import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
let app = express()
import { DBConnect } from './config/DbConnect.js'

import commentRoute from './routes/Comments/comment.route.js'
import postRoute from './routes/Posts/post.route.js'
import userRouter from './routes/Users/user.route.js'
import categoryRoute from './routes/categories/category.route.js'
import { globalErrorHandler } from './middlewares/globalErrorHandler.js'





// middlewares
app.use(express.json())


//routes
app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRoute)
app.use('/api/v1/comments', commentRoute)
app.use('/api/v1/categories', categoryRoute)


//handle Error
app.use(globalErrorHandler)

//404 error
app.use('*',(req ,res)=>{
    res.status(404).json({msg: `${req.originalUrl} - your path not found `})
})


//listen to server
DBConnect()
const port = process.env.port || 3000
app.listen(port, () => {
    console.log(`Our server is working on ${port}`);
})