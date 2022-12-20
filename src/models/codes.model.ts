import mongoose, { Model, Schema, Types } from 'mongoose';

export interface Code {
  code: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'HOLD';
  subscribeId: Types.ObjectId;
  userId: Types.ObjectId;
}

type CodesModel = Model<Code, {}>;

const codesSchema = new mongoose.Schema<Code, CodesModel>(
  {
    code: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'HOLD'],
      default: 'ACTIVE'
    },
    subscribeId: { type: Schema.Types.ObjectId, ref: 'Subscribes' },
    userId: { type: Schema.Types.ObjectId, ref: 'Users' }
  },
  {
    versionKey: false
  }
);

const Codes = mongoose.model<Code, CodesModel>('Codes', codesSchema, 'codes');

export default Codes;
