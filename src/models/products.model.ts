import mongoose, { Model } from 'mongoose';

export interface IProducts {
  sitesCount: number;
  name: string;
  prices: [{ price: string }];
}

type ProductsModel = Model<IProducts, {}>;

const productsSchema = new mongoose.Schema<IProducts, ProductsModel>(
  {
    sitesCount: {
      type: Number
    },
    name: String,
    prices: [{ String }]
  },
  {
    versionKey: false
  }
);

const Products = mongoose.model<IProducts, ProductsModel>('Products', productsSchema);

export default Products;
