import { userModel } from './../../models/User/User.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../utils/generateToken.js'
import { appError, AppError } from '../../utils/appError.js'
import { postModel } from '../../models/Post/post.model.js'
import { categoryModel } from '../../models/Category/Category.model.js'
import { commentModel } from '../../models/Comments/Comment.model.js'
import cloudinary from '../../config/cloudinary.js'


//Register
export const userRegister = async (req, res, next) => {
    const { firstName, lastName, Email, password } = req.body
    try {
        const userFound = await userModel.findOne({ Email })
        if (userFound) {
            return next(new AppError('user already exist', 500))
        }
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)
        const user = await userModel.create({ firstName, lastName, Email, password: passwordHash })
        res.json({ status: "success", data: user })


    } catch (error) {
        next(appError(error.message))
    }
}

//Login
export const loginUser = async (req, res, next) => {
    const { Email, password } = req.body
    try {
        const userFound = await userModel.findOne({ Email })
        if (!userFound) {

            return next(appError(" worng login credentials"))
        }

        const passwordMatched = await bcrypt.compare(password, userFound.password)

        if (!passwordMatched) {
            return next(appError(" worng login credentials"))

        }

        res.json({
            status: "success", data: {
                firstName: userFound.firstName,
                lastName: userFound.lastName,
                Email: userFound.Email,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id)
            }
        })

    } catch (error) {
        next(appError(error.message))
    }
}

//who view my profile
export const whoViewMyProfile = async (req, res, next) => {

    try {

        const user = await userModel.findById(req.params.id)

        const userWhoViewed = await userModel.findById(req.userAuth)

        if (user && userWhoViewed) {

            const isUserAlreadyViewed = user.viewers.find(viewer => viewer.toString() === userWhoViewed._id.toString())

            console.log(isUserAlreadyViewed);
            if (isUserAlreadyViewed) {

                return next(appError("you are Already viewd this profile"))

            } else {
                user.viewers.push(userWhoViewed._id)
                await user.save()
                res.json({
                    status: "success",
                    data: "You have successfully viewed this profile"
                })
            }
        }
    } catch (error) {
        next(appError(error.message));

    }
}


//following
export const following = async (req, res, next) => {

    try {
        const userToFollow = await userModel.findById(req.params.id)


        const userWhoFollow = await userModel.findById(req.userAuth)

        if (userToFollow && userWhoFollow) {

            const isUserAlreadyFollowed = userToFollow.followers.find(elem => elem.toString() === userWhoFollow._id.toString());


            console.log(isUserAlreadyFollowed);
            if (isUserAlreadyFollowed) {
                return next(appError("You already followed this user"));
            } else {
                userToFollow.followers.push(userWhoFollow._id)

                userWhoFollow.following.push(userToFollow._id)

                await userWhoFollow.save()

                await userToFollow.save()
                res.json({
                    status: "success",
                    data: "You have successfully followed this Account"
                })
            }

        }
    }
    catch (error) {
        next(appError(error.message));
    }


}


//unFollowing
export const unFollowing = async (req, res, next) => {

    try {
        const userToBeUnFollowed = await userModel.findById(req.params.id)

        const userWhoUnFollow = await userModel.findById(req.userAuth)

        if (userToBeUnFollowed && userWhoUnFollow) {
            const isUserAlreadyFollowed = userToBeUnFollowed.followers.find(follower => follower.toString() === userWhoUnFollow._id.toString())


            if (!isUserAlreadyFollowed) {
                return next(appError('You have not followed this user'))
            } else {
                userToBeUnFollowed.followers = userToBeUnFollowed.followers.filter(follower => follower.toString() !== userWhoUnFollow._id.toString())

                await userToBeUnFollowed.save()

                userWhoUnFollow.following = userWhoUnFollow.following.filter(following => following.toString() !== userToBeUnFollowed._id.toString())

                await userWhoUnFollow.save()

                res.json({
                    status: "success",
                    data: "You have successfully Un-Follow this Account"
                })
            }
        }
    }
    catch (error) {
        next(appError(error.message));
    }
}

//profile
export const userProfile = async (req, res, next) => {

    try {

        const user = await userModel.findById(req.userAuth)
        res.json({
            status: "success",
            data: "profile data", user
        })
    } catch (error) {
        next(appError(error.message, 500));

    }


}

//block
export const blockUser = async (req, res, next) => {

    try {

        const userToBeBlocked = await userModel.findById(req.params.id)

        const userWhoBlocked = await userModel.findById(req.userAuth)

        if (userWhoBlocked && userToBeBlocked) {
            const isUserAlreadyBloked = userWhoBlocked.blocked.find(blocked => blocked.toString() === userToBeBlocked._id.toString())

            if (isUserAlreadyBloked) {
                return next(appError("you already blocked this user"))
            }

            userWhoBlocked.blocked.push(userToBeBlocked._id)

            await userWhoBlocked.save()

            res.json({
                status: "success",
                data: "You have successfully blocked this user "
            })
        }
    } catch (error) {
        next(appError(error.message, 500));

    }
}

//unblock
export const unBlockUser = async (req, res, next) => {

    try {
        const userToBeUnblock = await userModel.findById(req.params.id)

        const userWhoUnBlock = await userModel.findById(req.userAuth)

        if (userToBeUnblock && userWhoUnBlock) {
            const isUserAlreadyBloked = userWhoUnBlock.blocked.find(blocked => blocked.toString() === userToBeUnblock._id.toString())

            if (!isUserAlreadyBloked) {
                return next(appError("you have not blocked this user"))
            }

            userWhoUnBlock.blocked = userWhoUnBlock.blocked.filter(blocked => blocked.toString() !== userToBeUnblock._id.toString())

            await userWhoUnBlock.save()

            res.json({
                status: "success",
                data: "You have successfully Unblocked this user "
            })
        }




    } catch (error) {
        next(appError(error.message, 500));

    }
}


//Admin Block
export const adminBlockUser = async (req, res, next) => {

    try {
        const userToBeBlock = await userModel.findById(req.params.id)

        if (!userToBeBlock) {
            return next(appError("user Not Found"))
        }

        userToBeBlock.isBlocked = true

        await userToBeBlock.save()
        res.json({
            status: "success",
            data: "You have successfully blocked this user "
        })
    } catch (error) {
        next(appError(error.message, 500));

    }
}

// Admin unBlock
export const adminUnBlockUser = async (req, res, next) => {

    try {
        const userToUnBeBlock = await userModel.findById(req.params.id)

        if (!userToUnBeBlock) {
            return next(appError("user Not Found"))
        }

        userToUnBeBlock.isBlocked = false

        await userToUnBeBlock.save()
        res.json({
            status: "success",
            data: "You have successfully Unblocked this user "
        })
    } catch (error) {
        next(appError(error.message, 500));

    }
}


//Profile Photo Upload
export const profilePhotoUpload = async (req, res, next) => {
    console.log(req.file);
    try {
        const userToUpdate = await userModel.findById(req.userAuth)

        if (!userToUpdate) {
            return next(appError("User not found", 404))
        }

        if (userToUpdate.isBlocked) {
            return next(appError("Action Not allowed  , your Account is blocked", 403))
        }

        

          let pic =  await cloudinary.uploader.upload(req.file.path,{folder:"profile pic"})
          console.log(pic);
            await userModel.findByIdAndUpdate(
                req.userAuth,
                {
                    $set: {
                        profilePhoto: pic.secure_url
                    },
                },
                {
                    new: true,
                }
            );
            res.json({
                status: "success",
                data: req.file
            });
        
    } catch (error) {
        next(appError(error.message, 500))
    }

}


export const updateProfile = async (req, res, next) => {
    const { email, firstName, lastName } = req.body

    try {
        if (email) {
            const emailTeken = await userModel.findOne({ email })
            if (emailTeken) {
                return next(appError("Email is teken", 500))
            }
        }
        const user = await userModel.findByIdAndUpdate(req.userAuth, {
            firstName, lastName, email
        }, {
            new: true,
            runValidators: true
        })
        res.json({
            status: "success",
            data: user
        })
    } catch (error) {
        next(appError(error.message, 500))
    }

}

export const updatePasswordUser = async (req, res, next) => {

    const { password } = req.body

    try {
        if (password) {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)

            const user = await userModel.findByIdAndUpdate(req.userAuth, {
                password: hashPassword
            },
                { new: true, runValidators: true })
            res.json({
                status: "success",
                data: "Password has been changed successfully",
            })
        } else {
            return next(appError("Please provide password field"));
        }
    } catch (error) {
        next(appError(error.message, 500))
    }
}



export const daleteUser = async (req, res, next) => {

    try {
        const userToDelete = await userModel.findById(req.userAuth)

        await postModel.deleteMany({ user: req.userAuth })

        await commentModel.deleteMany({ user: req.userAuth })

        await categoryModel.deleteMany({ user: req.userAuth })

        await userToDelete.delete();

        return res.json({
            status: "success",
            data: "Your account has been deleted successfully",
        });

    } catch (error) {
        next(appError(error.message, 500))
    }
}