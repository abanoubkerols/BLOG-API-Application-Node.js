import { mongoose } from 'mongoose'

//  Create Schema

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [true, "Post is required"],
    },
    user: {
        type: Object,
        required: [true, "user is required"],
    },
    description: {
        type: String,
        required: [true, "description is required"]
    }
},
    {
        timestamps: true
    })

    export const commentModel = mongoose.model('Comment',commentSchema)