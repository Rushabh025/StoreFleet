import { timeStamp } from "console";
import mongoose from "mongoose";

const producSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description name is required"],
      minLength: [
        10,
        "Product description should be atleat 10 characters long",
      ],
    },
    price: {
      type: Number,
      required: [true, "Product price  is required"],
      maxLength: [8, "Price can be of maximum 8 digits"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "Mobile",
        "Electronics",
        "Clothing",
        "Home & Garden",
        "Automotive",
        "Health & Beauty",
        "Sports & Outdoors",
        "Toys & Games",
        "Books & Media",
        "Jewelry",
        "Food & Grocery",
        "Furniture",
        "Shoes",
        "Pet Supplies",
        "Office Supplies",
        "Baby & Kids",
        "Art & Collectibles",
        "Travel & Luggage",
        "Music Instruments",
        "Electrical Appliances",
        "Handmade Crafts",
      ],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is mandatory"],
      maxLength: [5, "Stock can be maximum 5 digits"],
      default: 1,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  timeStamp
);

const ProductModel = mongoose.model("Product", producSchema);
export default ProductModel;
