import mongoose, { Model, Schema, Types } from 'mongoose';
import { Code } from './codes.model.js';

interface Subscribe {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  status: string;
  codes?: Code[];
}

type SubscribeModel = Model<Subscribe, {}>;

const subscribesSchema = new mongoose.Schema<Subscribe, SubscribeModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    productId: { type: Schema.Types.ObjectId, ref: 'Products' },
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    status: {
      type: String,
      default: 'ACTIVE'
    }
  },
  {
    versionKey: false
  }
);

const Subscribes = mongoose.model<Subscribe, SubscribeModel>(
  'Subscribes',
  subscribesSchema,
  'subscribes'
);

export default Subscribes;
