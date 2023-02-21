
import dotenv from 'dotenv'
dotenv.config()
export const globalErrorHandler =  (err, req, res, next) => {
    const stack = err.stack
    const message = err.message
    const status = err.status ? err.status : 'faild'
    const statusCode = err?.statusCode ? err.statusCode : 500

    res.status(statusCode).json({
        stack,status,message
    });
}