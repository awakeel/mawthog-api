require('mocha-generators').install(); // make mocha support generator
const expect = require('chai').expect;
const convert = require('./');
const { LedgerAccount } = require('../../models');

describe('Sequelize Model to GQL Conversion', () => {
  it('should work', function*() {
    expect(convert(LedgerAccount).replace(/\s/g, '')).to.equal(`
  id: Int!
  createdBy: String!
  code: Int
  name: String!
  accountType: String!
  status: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  parentId: Int
  createdByUserId: Int
  userId: Int
`.replace(/\s/g, ''),
    );
  });
});
