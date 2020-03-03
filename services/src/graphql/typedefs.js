const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const join = path.resolve;
const result = {
  types: {},
};

result.isReady = new Promise((resolve, reject) => {
  try {
    fs.readdirSync(__dirname).forEach((file) => {
      const dir = join(__dirname, file);
      const stats = fs.lstatSync(dir);
      if (stats.isDirectory()) {
        result.types[file] = require(`${dir}/types.js`);
      }
    });
  } catch (ex) {
    reject(ex);
  }

  resolve(true);
});

module.exports = result;
