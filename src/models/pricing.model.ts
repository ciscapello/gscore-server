import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema(
  {
    price: String,
    title: String,
    text: String,
    features: [String]
  },
  {
    versionKey: false
  }
);

const Pricing = mongoose.model('Pricing', pricingSchema, 'pricing');

export default Pricing;
