import { v4 as uuidv4 } from 'uuid';
export const codeGenerator = (count, subscribeId, userId) => {
    if (count <= 0)
        return;
    const res = [];
    for (let i = count; i > 0; i--) {
        res.push({
            code: uuidv4(),
            subscribeId,
            userId
        });
    }
    return res;
};
//# sourceMappingURL=codeGenerator.js.map