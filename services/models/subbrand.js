module.exports = function(sequelize, DataTypes) {
    const CONSTANTS = {
      STATUS: {
        ACTIVE: 'active',
        DELETED: 'deleted',
      },
      TYPE: {
        LISTING_TYPE: 'cls_',
      },
    };
  
    const Model = sequelize.define('subbrands', {
      
      brand: {
        type: DataTypes.STRING,
      },
      cls: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {modulename: 'subbrands'})
    Model.associate = (models) => {
        Model.belongsTo(models.brands, { as: 'subbrands' ,foreignKey: 'brandId'});
      };
    
      const instanceMethods = {
        toJSON() {
          // is required to make sure the included association models also run its own toJSON
          return this.get();
        },
      };
    
      Object.keys(instanceMethods).forEach((key) => (Model.prototype[key] = instanceMethods[key]));
    
      Model.CONSTANTS = { ...CONSTANTS };
    
      return Model;
    };
    
