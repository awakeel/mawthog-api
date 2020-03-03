const _ = require('lodash');

let customTypeMapper;
/**
 * A function to set a custom mapping of types
 * @param {Function} mapFunc
 */
module.exports.mapType = function mapType(mapFunc) {
  customTypeMapper = mapFunc;
};

/**
 * Checks the type of the sequelize data type and
 * returns the corresponding type in GraphQL
 * @param  {Object} sequelizeType
 * @param  {Object} sequelizeTypes
 * @return {Function} GraphQL type declaration
 */
module.exports.toGraphQL = function toGraphQL(sequelizeType, sequelizeTypes) {
  // did the user supply a mapping function?
  // use their mapping, if it returns truthy
  // else use our defaults
  if (customTypeMapper) {
    const result = customTypeMapper(sequelizeType);
    if (result) return result;
  }

  const {
    BOOLEAN,
    ENUM,
    FLOAT,
    REAL,
    CHAR,
    DECIMAL,
    DOUBLE,
    INTEGER,
    BIGINT,
    STRING,
    TEXT,
    UUID,
    DATE,
    DATEONLY,
    TIME,
    ARRAY,
    VIRTUAL,
    JSON,
    JSONB,
  } = sequelizeTypes;

  // Map of special characters
  const specialCharsMap = new Map([['¼', 'frac14'], ['½', 'frac12'], ['¾', 'frac34']]);

  if (sequelizeType instanceof BOOLEAN) return 'Boolean';

  if (sequelizeType instanceof FLOAT || sequelizeType instanceof REAL || sequelizeType instanceof DOUBLE) return 'Float';

  if (sequelizeType instanceof DATE) {
    return 'DateTime';
  }
  if (sequelizeType instanceof DATEONLY) {
    return 'Date';
  }

  if (
    sequelizeType instanceof CHAR ||
    sequelizeType instanceof STRING ||
    sequelizeType instanceof TEXT ||
    sequelizeType instanceof UUID ||
    sequelizeType instanceof TIME ||
    sequelizeType instanceof BIGINT ||
    sequelizeType instanceof DECIMAL
  ) {
    return 'String';
  }

  if (sequelizeType instanceof INTEGER) {
    return 'Int';
  }

  if (sequelizeType instanceof ARRAY) {
    return `[${toGraphQL(sequelizeType.type, sequelizeTypes)}]`;
  }

  if (sequelizeType instanceof ENUM) {
    return `enum tempEnumName {
      ${_(sequelizeType.values)
      .mapKeys(sanitizeEnumValue)
      .mapValues((v) => ({ value: v }))
      .value()
      .join('/n')}
    }`;
  }

  if (sequelizeType instanceof VIRTUAL) {
    const returnType = sequelizeType.returnType ? toGraphQL(sequelizeType.returnType, sequelizeTypes) : 'String';
    return returnType;
  }

  if (sequelizeType instanceof JSONB || sequelizeType instanceof JSON) {
    return 'JSON';
  }

  throw new Error(`Unable to convert ${sequelizeType.key || sequelizeType.toSql()} to a GraphQL type`);

  function sanitizeEnumValue(value) {
    return value
      .trim()
      .replace(/([^_a-zA-Z0-9])/g, (_, p) => specialCharsMap.get(p) || ' ')
      .split(' ')
      .map((v, i) => (i ? _.upperFirst(v) : v))
      .join('')
      .replace(/(^\d)/, '_$1');
  }
};
