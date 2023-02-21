import { commentModel } from "../../models/Comments/Comment.model.js";
import { postModel } from "../../models/Post/post.model.js";
import { userModel } from "../../models/User/User.model.js";

import { appError, AppError } from '../../utils/appError.js'



//create
export const createComment = async (req, res, next) => {
    const { description } = req.body;
    try {
        
        const post = await postModel.findById(req.params.id);
        
        const comment = await commentModel.create({
            post: post._id,
            description,
            user: req.userAuth,
        });
        
        post.comments.push(comment._id);
      
        const user = await userModel.findById(req.userAuth);
        
        user.comments.push(comment._id);
      
        await post.save({ validateBeforeSave: false });
        await user.save({ validateBeforeSave: false });

        res.json({
            status: "success",
            data: comment,
        });
    } catch (error) {
        next(appError(error.message));
    }
};

//delete
export const deleteComment = async (req, res, next) => {
    try {
      
        const comment = await commentModel.findById(req.params.id);
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(appError("You are not allowed to update this comment", 403));
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            data: "Comment has been deleted successfully",
        });
    } catch (error) {
        next(appError(error.message));
    }
};

//update
export const updateComment = async (req, res, next) => {
    const { description } = req.body;
    try {
       
        const comment = await commentModel.findById(req.params.id);
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(appError("You are not allowed to update this comment", 403));
        }

        const category = await commentModel.findByIdAndUpdate(
            req.params.id,
            { description },
            { new: true, runValidators: true }
        );
        res.json({
            status: "success",
            data: category,
        });
    } catch (error) {
        next(appError(error.message));
    }
};
