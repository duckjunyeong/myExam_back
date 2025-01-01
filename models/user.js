const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
        },

        nickname: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },

        password: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
      },
      {
        modelName: "User",
        tableName: "User",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.ExamList, { foreignKey: "UserId" });
  }
};
