import { Types } from 'mongoose';
import { Code } from '../models/codes.model.js';
import { v4 as uuidv4 } from 'uuid';

export const codeGenerator = (
  count: number,
  subscribeId: Types.ObjectId,
  userId: Types.ObjectId
): Code[] | undefined => {
  if (count <= 0) return;
  const res: Code[] = [];
  console.log(count);
  for (let i = count; i > 0; i--) {
    res.push({
      code: uuidv4(),
      subscribeId,
      userId
    });
  }
  console.log('codes', res);
  return res;
};
