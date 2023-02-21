
import cloudinary from 'cloudinary'

import multer from 'multer'

import dotenv from 'dotenv'
dotenv.config()



 cloudinary.v2.config({
    cloud_name: process.env.cloudinary_Cloud_Name,
    api_key: process.env.cloudinary_Api_key,
    api_secret: process.env.cloudinary_Secret_key
})

export const validationType= {
    image:["image/png", "image/jpg" , "image/jpeg" , "image/svg"]
}

export const storage = multer.diskStorage({
   
})

 
function fileFilter(req, file, cb) {
    if (validationType.image.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb("false", false)

    }
}

export default cloudinary.v2

export const upload = multer({ storage: storage, dest: '/blog-api' ,fileFilter })

