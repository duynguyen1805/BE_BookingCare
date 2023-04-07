"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // định danh các mối quan hệ
      Allcode.hasMany(models.User, {
        foreignKey: "positionId",
        as: "positionData",
      });
      Allcode.hasMany(models.User, { foreignKey: "gender", as: "genderData" });
      Allcode.hasMany(models.Schedule, {
        foreignKey: "timeType",
        as: "timeTypeData",
      });

      Allcode.hasMany(models.Doctor_Infor, {
        foreignKey: "priceId",
        as: "priceData",
      });
      Allcode.hasMany(models.Doctor_Infor, {
        foreignKey: "provinceId",
        as: "provinceData",
      });
      Allcode.hasMany(models.Doctor_Infor, {
        foreignKey: "paymentId",
        as: "paymentData",
      });
      Allcode.hasMany(models.Booking, {
        foreignKey: "timeType",
        as: "timeTypeDataPatient",
      });
    }
  }
  Allcode.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEN: DataTypes.STRING,
      valueVI: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Allcode",
    }
  );
  return Allcode;
};
