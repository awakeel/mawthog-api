
module.exports = function(sequelize, DataTypes) {
  const CONSTANTS = {
    ROLE: {
      PUBLIC: 'public',
      SHOWROOM: 'showroom',
      BANK: 'bank',
      DEALER: 'dealer',
      ADMIN: 'admin',
      STAFF: 'staff',
    },
    ACCOUNT_TYPE: {
      SELF_MANAGED: 'self-managed',
      FULL_SERVICE: 'full service',
    },
    STATUS: {
      ACTIVE: 'active',
      DELETED: 'deleted',
    },
  };

  const Model = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey:true,
     
      allowNull: false,
    }, 
    name:{
      type: DataTypes.STRING
    },
      email: {
        type: DataTypes.STRING,
        unique: {
          fields: ['email'],
          msg: 'Email already exists',
        },
        validate: {
          isEmail: true,
          formatLowerCase: function formatLowerCase(value) {
            if (typeof value === 'string') {
              this.email = value.toLowerCase();
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          minPasswordLength: function minPasswordLength(value) {
            if (value.length < 5) {
              throw new Error('Password is too short, it is less than 5 characters.');
            }
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        validate: {
          isIn: [Object.values(CONSTANTS.ROLE)],
        },
        allowNull: false,
      }, 
      picture: {
        type: DataTypes.STRING,
      },
      pictureUrl: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['email']),
        get() {
          if (this.get('picture')) return this.get('picture');
          return null;
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        // validate: {
        //   isValidPhoneNo() {
        //     const phoneNumber = formatPhoneNumber(this.phoneNumber);
        //     if (!phoneNumber) {
        //       throw new Error('A valid phone number is required');
        //     }
        //     this.phoneNumber = phoneNumber;
        //   },
        // },
      }, 
      isEmailVerified: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [Object.values(CONSTANTS.STATUS)],
        },
        defaultValue: CONSTANTS.STATUS.ACTIVE,
      }, 
      isPhoneNumberVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId:{
        type: DataTypes.INTEGER,
        reference:{
          model
        }
      }

}, {modulename: 'users'});

  Model.associate = (models) => {
    Model.hasMany(models.Car, { as: 'Car', foreignKey: "userId"});  
  };

  

  const instanceMethods = {
    toJSON() {
      // is required to make sure the included association models also run its own toJSON
      return this.get();
    },
  };

  Object.keys(instanceMethods).forEach((key) => (Model.prototype[key] = instanceMethods[key]));

  Model.CONSTANTS = Object.assign({}, CONSTANTS);

  return Model;
};
