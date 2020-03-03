const _ = require('lodash'); 

module.exports = {
 
  Query: {
    users: async (root, args, { user, models }) => {
      const { User } = models; 

    //   if (!(user && user.role === User.CONSTANTS.ROLE.STAFF)) {
    //     throw new Error('Insufficient permission rights');
    //   }
        return await User.findAll();

    } 
}
}