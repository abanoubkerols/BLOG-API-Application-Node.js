import { categoryModel } from '../../models/Category/Category.model.js'
import { appError, AppError } from '../../utils/appError.js'



//create
export const createCategory = async (req, res, next) => {
    const { title } = req.body;
    try {
        const category = await categoryModel.create({ title, user: req.userAuth });
        res.json({
            status: "success",
            data: category,
        });
    } catch (error) {
        return next(appError(error.message));
    }
};

//all
export const fetchCategories = async (req, res , next) => {
    try {
        const categories = await categoryModel.find();
        res.json({
            status: "success",
            data: categories,
        });
    } catch (error) {
        return next(appError(error.message));
    }
};


// get  one category 
export const oneCategory = async (req, res , next) => {
    try {
        const Category = await categoryModel.findById(req.params.id);
        res.json({
            status: "success",
            data: Category,
        });
    } catch (error) {
        return next(appError(error.message));
    }
};



//Delete
export const deleteCategory = async (req, res ,next) => {
    try {
      await categoryModel.findByIdAndDelete(req.params.id);
      res.json({
        status: "success",
        data: "Deleted successfully",
      });
    } catch (error) {
        return next(appError(error.message));
    }
  };
  
  //update
  export const updateCategory = async (req, res ,next) => {
    const { title } = req.body;
    try {
      const category = await categoryModel.findByIdAndUpdate(
        req.params.id,
        { title },
        { new: true, runValidators: true }
      );
      res.json({
        status: "success",
        data: category,
      });
    } catch (error) {
        return next(appError(error.message));

    }
  };
  