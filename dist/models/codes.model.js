import mongoose, { Schema } from 'mongoose';
const codesSchema = new mongoose.Schema({
    code: String,
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'HOLD'],
        default: 'INACTIVE'
    },
    subscribeId: { type: Schema.Types.ObjectId, ref: 'Subscribes' },
    userId: { type: Schema.Types.ObjectId, ref: 'Users' }
}, {
    versionKey: false
});
const Codes = mongoose.model('Codes', codesSchema, 'codes');
export default Codes;
//# sourceMappingURL=codes.model.js.map