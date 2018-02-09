const fs = require('fs-extra');

module.exports = function fileExistsWithMode(filePath, mode) {
    return fs.access(filePath, mode).then(() => {

        return true;
    }).catch(() => {

        return fs.access(filePath, fs.constants.F_OK)
            .then(() => {

                throw new Error(`File ${filePath} exists, but not writeable, update permissions`);
            })
            .catch(() => {

                return false;
            });
    });
};
