import mongoose, { Schema } from 'mongoose';
const subscribesSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    productId: { type: Schema.Types.ObjectId, ref: 'Products' },
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    status: {
        type: String,
        default: 'ACTIVE'
    },
    sitesCount: {
        type: Number
    }
}, {
    versionKey: false
});
const Subscribes = mongoose.model('Subscribes', subscribesSchema, 'subscribes');
export default Subscribes;
//# sourceMappingURL=subscribes.model.js.map