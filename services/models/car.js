module.exports = function(sequelize, DataTypes) {
  const CONSTANTS = {
    TYPE: {
      USED: 'USED',
      NEW: 'NEW'
    },
    STATUS: {
      SOLD: 'SOLD',
      Active: 'Active',
      BOOKED: 'Booked',
    }
  };

  const Model = sequelize.define('Car', {
    color: {
      type: DataTypes.STRING,
    },
    fuelType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gearType: {
      type: DataTypes.STRING,
    },
    incomingType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    specifications: {
      type: DataTypes.STRING,
    },
  
    // detail: {
    //   type: DataTypes.VIRTUAL(DataTypes.STRING, ['brand', 'subBrand', 'model']),
    //   get() {
    //     return `${this.get('brand')} ${this.get('subBrand')} ${this.get('model')}`;
    //   },
    // },
    marketValue: {
      type: DataTypes.DECIMAL(10),
    },
    description: {
      type: DataTypes.TEXT,
    },
    priceTag:{
        type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [Object.values(CONSTANTS.STATUS)],
      },
    },
  }, {modulename: 'cars'});
 

  Model.addHook('afterCreate', (instance, options) =>{
      //sendEmail(Config.requestNotificationEmail, 'New car added with customer!', `${JSON.stringify(instance, null, 2)}`);
    });

  Model.associate = (models) => {
    // @deprecated
    Model.belongsTo(models.brands, { as: 'brands', foreignKey:"brandId" });
    Model.belongsTo(models.subbrands, { as: 'subbrands', foreignKey:"subBrandId" }); 
    Model.belongsTo(models.User, { as: 'User', foreignKey:"userId" }); 

  };
  const instanceMethods = {
    toJSON() {
        return this.get();
    },
   };
  Object.keys(instanceMethods).forEach((key) => (Model.prototype[key] = instanceMethods[key]));
  Model.CONSTANTS = Object.assign({}, CONSTANTS);
  return Model;
};
