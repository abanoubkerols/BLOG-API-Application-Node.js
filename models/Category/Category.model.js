import { mongoose } from 'mongoose'

//  Create Schema

const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

    export const categoryModel = mongoose.model('Category',categorySchema)