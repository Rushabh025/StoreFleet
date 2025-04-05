// Please don't change the pre-written code
// Import the necessary modules here

import { ErrorHandler } from "../../../utils/errorHandler.js";
import {
  addNewProductRepo,
  deleProductRepo,
  findProductRepo,
  getAllProductsRepo,
  getProductDetailsRepo,
  getTotalCountsOfProduct,
  updateProductRepo,
} from "../model/product.repository.js";
import ProductModel from "../model/product.schema.js";

export const addNewProduct = async (req, res, next) => {
  try {
    const product = await addNewProductRepo({
      ...req.body,
      createdBy: req.user._id,
    });
    if (product) {
      res.status(201).json({ success: true, product });
    } else {
      return next(new ErrorHandler(400, "Some error occured!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const getAllProducts = async (req, res, next) => {
  // Implement the functionality for search, filter and pagination this function.
  try {
    const filter = {};
    const page = parseInt(req.query.page, 10) || 1;
    const pagesize = parseInt(req.query.pagesize, 10) || 5;

    // check for keyword in name
    if(req.query.keyword){
      const keyword = req.query.keyword.trim();
      filter.name = { $regex: new RegExp(keyword, 'i') };
    }

    // check for category
    if(req.query.category){
      filter.category = req.query.category;
    }
   
    // Loop through each query key
    for (const key in req.query) {
      const value = req.query[key];
      // Skip 'keyword' since we already handled it
      if (key === 'keyword') continue;

      // Handle range filters like price, rating, etc.
      if (typeof value === 'object') {
        filter[key] = {};
        for (const operator in value) {
          filter[key][`$${operator}`] = Number(value[operator]);
        }
      }
    }
    
    const products = await ProductModel.aggregate([
      {
        $match : filter
      },
      {
        $facet: {
          metadata : [{$count : "totalCount"}],
          data : [{$skip : (page - 1) * pagesize}, {$limit : pagesize}]
        }
      }
    ])

    if (products) {
      res.status(201).json({ success: true, products });
    } else {
      return next(new ErrorHandler(400, "Some error occured!"));
    }

  } catch (error) {
    // console.log(error);
    return next(new ErrorHandler(400, error));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await updateProductRepo(req.params.id, req.body);
    if (updatedProduct) {
      res.status(200).json({ success: true, updatedProduct });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await deleProductRepo(req.params.id);
    if (deletedProduct) {
      res.status(200).json({ success: true, deletedProduct });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const getProductDetails = async (req, res, next) => {
  try {
    const productDetails = await getProductDetailsRepo(req.params.id);
    if (productDetails) {
      res.status(200).json({ success: true, productDetails });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const rateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body;
    const user = req.user._id;
    const name = req.user.name;
    const review = {
      user,
      name,
      rating: Number(rating),
      comment,
    };
    if (!rating) {
      return next(new ErrorHandler(400, "Rating can't be empty"));
    }
    const product = await findProductRepo(productId);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    const findRevieweIndex = product.reviews.findIndex((rev) => {
      return rev.user.toString() === user.toString();
    });
    if (findRevieweIndex >= 0) {
      product.reviews.splice(findRevieweIndex, 1, review);
    } else {
      product.reviews.push(review);
    }
    let avgRating = 0;
    product.reviews.forEach((rev) => {
      avgRating += rev.rating;
    });
    const updatedRatingOfProduct = avgRating / product.reviews.length;
    product.rating = updatedRatingOfProduct;
    await product.save({ validateBeforeSave: false });
    res
      .status(201)
      .json({ success: true, msg: "Thank you for rating the product", product });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const getAllReviewsOfAProduct = async (req, res, next) => {
  try {
    const product = await findProductRepo(req.params.id);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const deleteReview = async (req, res, next) => {
  /* Insert the essential code into this controller wherever necessary to resolve issues 
  related to removing reviews and updating product ratings. */

  try {
    const { productId, reviewId } = req.query;
    const userData = req.user;
    
    if (!productId || !reviewId) {
      return next(
        new ErrorHandler(
          400,
          "Please provide productId and reviewId as query params"
        )
      );
    }
    
    const product = await findProductRepo(productId);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    const reviews = product.reviews;
    // console.log(reviews);

    const isReviewExistIndex = reviews.findIndex((rev) => {
      return rev._id.toString() === reviewId.toString();
    });
    if (isReviewExistIndex < 0) {
      return next(new ErrorHandler(400, "Review doesn't exist"));
    }

    const reviewToBeDeleted = reviews[isReviewExistIndex];

    // Check if the logged-in user is the one who wrote the review
    if (reviewToBeDeleted.user.toString() !== userData._id.toString()) {
      return next(new ErrorHandler(403, "You are not authorised to delete this review"));
    }

    // Remove the review
    reviews.splice(isReviewExistIndex, 1);

    // Recalculate average rating and number of reviews
    product.rating =
      reviews.reduce((sum, rev) => sum + rev.rating, 0) / (reviews.length || 1);
    product.numOfReviews = reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      msg: "Review deleted successfully",
      deletedReview: reviewToBeDeleted,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
