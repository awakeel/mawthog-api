const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const join = path.resolve;
const result = {
  resolvers: {},
};

result.isReady = new Promise((resolve, reject) => {
  try {
    fs.readdirSync(__dirname).forEach((file) => {
      const dir = join(__dirname, file);
      const stats = fs.lstatSync(dir);
      if (stats.isDirectory()) {
        result.resolvers[file] = require(`${dir}/resolvers.js`);
      }
    });
    resolve(true);
  } catch (ex) {
    reject(ex);
  }
});

module.exports = result;
