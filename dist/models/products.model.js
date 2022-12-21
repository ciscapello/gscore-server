import mongoose from 'mongoose';
const productsSchema = new mongoose.Schema({
    sitesCount: {
        type: Number
    },
    name: String,
    prices: [{ String }]
}, {
    versionKey: false
});
const Products = mongoose.model('Products', productsSchema);
export default Products;
//# sourceMappingURL=products.model.js.map