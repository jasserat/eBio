const fs = require('fs');
const path = require('path');

const deleteFile = async (fileName) => {
  return new Promise(async (resolve, reject) => {
    let filePath = path.join(`${__dirname}/../../../, fileName`);
    if (filePath.includes('uploads')) {
      fs.unlink(filePath, () => {});
    }
  });
};

module.exports = deleteFile;