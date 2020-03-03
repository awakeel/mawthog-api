const _ = require('lodash'); 

module.exports = {
   
  Query: {
    cars: async (root, args, { user, models }) => {
      const { Car } = models; 

    //   if (!(user && user.role === User.CONSTANTS.ROLE.STAFF)) {
    //     throw new Error('Insufficient permission rights');
    //   }
        return await Car.findAll();

    } 
}
  // Fields resolvers

};
