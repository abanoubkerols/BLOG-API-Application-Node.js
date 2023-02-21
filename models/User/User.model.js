import { mongoose } from 'mongoose'
import { postModel } from '../Post/post.model.js'

//  Create Schema

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'firstName is required To Create Account'],
    },
    lastName: {
        type: String,
        required: [true, 'lastName is required To Create Account'],
    },
    profilePhoto: {
        type: String
    },
    Email: {
        type: String,
        required: [true, 'Email is required To Create Account'],
    },
    password: {
        type: String,
        required: [true, 'password is requiredd To Create Account'],
    },
    // postCount: {
    //     type: Number,
    //     default: 0
    // },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["Admin", "Guest", "Editor"],

    },
    viewers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    // active: {
    //     type: Boolean,
    //     default: true
    // },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    blocked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    // plane: 
    //     {
    //         type: String,
    //         enum: ['free', 'premium', 'pro'],
    //         default: 'free'
    //     }
    userAward: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold'],
        default: 'Bronze'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})


//Hooks 

//pre before record is saved

UserSchema.pre("findOne", async function (next) {

    this.populate({
        path:"posts"
    })
    const userId = this._conditions._id
    const postsFound = await postModel.find({ user: userId })


    const lastPost = postsFound[postsFound.length - 1]


    const lastPostDate = new Date(lastPost?.createdAt)
    const lastPostDateString = lastPostDate.toDateString()
    UserSchema.virtual('lastPostDate').get(function () {
        return lastPostDateString
    })

    // if user is active 
    const currentDate = new Date()
    const diff = currentDate - lastPostDate
    const diffInDays = diff / (1000 * 3600 * 24)

    if (diffInDays > 30) {
        UserSchema.virtual('isInactive').get(function () {
            return true
        })

        await userModel.findByIdAndUpdate(userId, {
            isBlocked: true
        },
            { new: true })

    } else {
        UserSchema.virtual('isInactive').get(function () {
            return false
        })
        await userModel.findByIdAndUpdate(userId, {
            isBlocked: false
        },
            { new: true })
    }

    // last active date

    const daysAgo = Math.floor(diffInDays)

    UserSchema.virtual('lastActive').get(function () {
        if (daysAgo <= 0) {
            return 'Today'
        }

        if (daysAgo === 1) {
            return 'Yesterday'
        }

        if (daysAgo > 1) {
            return `${daysAgo} days ago`
        }
    })

    // update user Award based on number of posts

    const numberOfPosts = postsFound.length

    if (numberOfPosts < 10) {
        await userModel.findByIdAndUpdate(userId, {
            userAward: 'Bronze'
        }, { new: true })
    }

    if (numberOfPosts > 10) {
        await userModel.findByIdAndUpdate(userId, {
            userAward: 'Silver'
        }, { new: true })
    }

    if(numberOfPosts > 20 ){
        await userModel.findByIdAndUpdate(userId,{
            userAward: 'Gold'
        },{new:true})
    }
    next()
})



//Get fullname
UserSchema.virtual("fullname").get(function () {
    return `${this.firstName} ${this.lastName} `;

});

//get user initials
UserSchema.virtual("initials").get(function () {
    return `${this.firstName[0]}${this.lastName[0]} `;
});

//get posts count
UserSchema.virtual("postCounts").get(function () {
    return this.posts.length;
});

//get followers count
UserSchema.virtual("followersCount").get(function () {
    return this.followers.length;
});

//get followers count
UserSchema.virtual("followingCount").get(function () {
    return this.following.length;
});

//get viewers count
UserSchema.virtual("viewersCount").get(function () {
    return this.viewers.length;
});

//get blocked count
UserSchema.virtual("blockedCount").get(function () {
    return this.blocked.length;
});


export const userModel = mongoose.model('User', UserSchema)