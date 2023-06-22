import mongoose, { ObjectId } from 'mongoose';

export type CartItem = {
   productId: ObjectId;
   quantity: number;
   price: number;
   total?: number;
};

export interface cart extends mongoose.Document {
   user_Id: ObjectId;
   productList: CartItem[];
   totalAfterDiscount?: number;
}

export const CartSchema: mongoose.Schema<cart> = new mongoose.Schema(
   {
      user_Id: { type: mongoose.Types.ObjectId, ref: 'User' },
      productList: [
         {
            productId: { type: mongoose.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number },
            price: { type: Number },
         },
      ],
      totalAfterDiscount: { type: Number },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
      collection: 'carts',
   }
);

CartSchema.virtual('total').get(function () {
   return this.productList.reduce((total, item) => total + item.price * item.quantity, 0);
});
export const cartModel: mongoose.Model<cart> = mongoose.model('Cart', CartSchema);
