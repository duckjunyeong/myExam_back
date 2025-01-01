const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class ExamList extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
        },
      },
      {
        modelName: "ExamList",
        tableName: "ExamList",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.ExamList.belongsTo(db.User, { foreignKey: "UserId" });
    db.ExamList.hasMany(db.ExamData, { foreignKey: "ExamListId" });
    db.ExamList.hasMany(db.ExamResult, { foreignKey: "ExamListId" });
  }
};
