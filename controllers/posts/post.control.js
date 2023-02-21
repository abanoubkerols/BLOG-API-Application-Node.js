import cloudinary from "../../config/cloudinary.js";
import { postModel } from "../../models/Post/post.model.js";
import { userModel } from "../../models/User/User.model.js";
import { appError, AppError } from '../../utils/appError.js'


export const createPost = async (req, res, next) => {
    const { title, description, category } = req.body

    try {
        const Author = await userModel.findById(req.userAuth)

        if (Author.isBlocked) {
            return next(appError("Access denied, account is blocked", 403))
        }
        let pic =  await cloudinary.uploader.upload(req.file.path,{folder:"post pic"})
        const postCreated = await postModel.create({
            title,
            description,
            user: Author._id,
            category,
            photo:pic.secure_url

        })

        Author.posts.push(postCreated)

        await Author.save()

        res.json({
            status: "success",
            data: postCreated
        })
    } catch (error) {
        next(appError(error.message))

    }
}


export const AllPosts = async (req, res, next) => {


    try {

        const posts = await postModel.find({}).populate("user").populate("category", "title")

        const filteredPosts = posts.filter((post) => {

            const blockedUsers = post.user.blocked
            const isBlocked = blockedUsers.includes(req.userAuth)

            // return !isBlocked
            return isBlocked ? null : post
        })
        res.json({
            status: "success",
            data: filteredPosts
        })
    } catch (error) {
        next(appError(error.message))
    }
}


export const LikesPostToggle = async (req, res, next) => {
    try {
        const post = await postModel.findById(req.params.id);

        const isLiked = post.likes.includes(req.userAuth);

        if (isLiked) {
            post.likes = post.likes.filter(
                like => like.toString() !== req.userAuth.toString()
            );
            await post.save();
        } else {

            post.likes.push(req.userAuth);
            post.disLikes.pop(req.userAuth);

            await post.save();
        }
        res.json({
            status: "success",
            data: post,
        });
    } catch (error) {
        next(appError(error.message));
    }
};


export const DisLikesPostToggle = async (req, res, next) => {
    try {

        const post = await postModel.findById(req.params.id);

        const isUnliked = post.disLikes.includes(req.userAuth);

        if (isUnliked) {
            post.disLikes = post.disLikes.filter(
                dislike => dislike.toString() !== req.userAuth.toString()
            );
            await post.save();
        } else {

            post.disLikes.push(req.userAuth);
            post.likes.pop(req.userAuth);
            await post.save();
        }
        res.json({
            status: "success",
            data: post,
        });
    } catch (error) {
        next(appError(error.message));
    }
};



//single post
export const postDetailsView = async (req, res, next) => {
    try {
        
        const post = await postModel.findById(req.params.id);
      
        const isViewed = post.numViews.includes(req.userAuth);
        if (isViewed) {
            res.json({
                status: "success",
                data: post,
            });
        } else {
            
            post.numViews.push(req.userAuth);
            
            await post.save();
            res.json({
                status: "success",
                data: post,
            });
        }
    } catch (error) {
        next(appError(error.message));
    }
};

//Delete
export const deletePost = async (req, res, next) => {
    try {
       
        const post = await postModel.findById(req.params.id);
        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appError("You are not allowed to delete this post", 403));
        }
        await postModel.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            data: "Post deleted successfully",
        });
    } catch (error) {
        next(appError(error.message));
    }
};

//update
export const updatePost = async (req, res, next) => {
    const { title, description, category } = req.body;
    try {
   
        const post = await postModel.findById(req.params.id);
    

        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appError("You are not allowed to delete this post", 403));
        }

        let pic =  await cloudinary.uploader.upload(req.file.path,{folder:"update pic post"})
        await postModel.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                category,
                photo: pic.secure_url
            },
            {
                new: true,
            }
        );
        res.json({
            status: "success",
            data: post,
        });
    } catch (error) {
        next(appError(error.message));
    }
};