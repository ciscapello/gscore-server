import * as fs from 'node:fs';
export const getFiles = function (dir, files_) {
    files_ = files_ || [];
    const files = fs.readdirSync(dir);
    for (let i in files) {
        const name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        }
        else {
            files_.push(name);
        }
    }
    return files_;
};
//# sourceMappingURL=getFiles.js.map