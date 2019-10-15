import { Document, model, Model, Schema } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  brand: string;
  price: number;
  image: string;
  description: string;
  owner: Schema.Types.ObjectId;
}

const productSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Product: Model<IProductDocument> = model<IProductDocument>(
  'Product',
  productSchema
);

export default Product;
