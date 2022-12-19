import mongoose, { Model } from 'mongoose';

export interface IProducts {
  name: string;
  description?: string;
  price: string;
  in_stock: boolean;
  images?: string[];
}

type ProductsModel = Model<IProducts, {}>;

const productsSchema = new mongoose.Schema<IProducts, ProductsModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required field'],
      unique: true
    },
    description: String,
    price: {
      type: String,
      required: [true, 'Price is required field']
    },
    in_stock: {
      type: Boolean,
      default: false
    },
    images: [String]
  },
  {
    versionKey: false
  }
);

const Products = mongoose.model<IProducts, ProductsModel>('Products', productsSchema);

export default Products;
