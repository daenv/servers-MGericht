import mongoose, { Schema, Model } from 'mongoose';

export interface Coupon {
   name: string;
   expiry: Date;
   discount: number;
}

export const couponSchema: Schema<Coupon> = new mongoose.Schema(
   {
      name: {
         type: String,
         trim: true,
         unique: true,
         uppercase: true,
      },
      expiry: { type: Date, required: true },
      discount: { type: Number, required: true },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
      collection: 'coupons',
   }
);
export const couponModel: Model<Coupon> = mongoose.model('Coupon', couponSchema);