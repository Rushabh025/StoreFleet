

import { createNewOrderRepo } from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const createNewOrder = async (req, res, next) => {
   const {shippingInfo,orderedItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;

   if(!shippingInfo){
    return next(new ErrorHandler(401 , 'Shipping Info Missing'));
   }
   if(!orderedItems){
    return next(new ErrorHandler(401) , 'Ordered Items Missing');
   }
};