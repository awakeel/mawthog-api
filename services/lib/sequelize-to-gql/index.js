const typeMapper = require('./type-mapper');

function convert(Model, options = {}) {
  const result = Object.keys(Model.rawAttributes).reduce((memo, key) => {
    if (options.exclude) {
      if (typeof options.exclude === 'function' && options.exclude(key)) return memo;
      if (Array.isArray(options.exclude) && ~options.exclude.indexOf(key)) return memo;
    }
    if (options.only) {
      if (typeof options.only === 'function' && !options.only(key)) return memo;
      if (Array.isArray(options.only) && !~options.only.indexOf(key)) return memo;
    }

    const attribute = Model.rawAttributes[key];
    const type = attribute.type;

    memo[key] = typeMapper.toGraphQL(type, Model.sequelize.constructor);

    if (!options.allowNull) {
      if (attribute.allowNull === false || attribute.primaryKey === true) {
        memo[key] = `${memo[key]}!`;
      }
    }

    return memo;
  }, {});

  return Object.keys(result)
    .map((key) => `${key}: ${result[key]}`)
    .join('\n');
}

module.exports = convert;
