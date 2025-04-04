// Please don't change the pre-written code
// Import the necessary modules here

import { createNewOrderRepo } from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const createNewOrder = async (req, res, next) => {
  // Write your code here for placing a new order
  
  try {
    const orderData = req.body;

    if (
      !orderData.shippingInfo ||
      !Array.isArray(orderData.orderedItems) || orderData.orderedItems.length === 0 ||
      !orderData.paymentInfo ||
      !orderData.itemsPrice ||
      !orderData.totalPrice ||
      !orderData.paidAt
    ) {
      return next(new ErrorHandler(400, "Missing required order fields"));
    }
    orderData.user = req.user._id;

    const orderPlaced = await createNewOrderRepo(orderData);
    res.status(201).json({ success: true, orderPlaced });

  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
