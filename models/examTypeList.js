const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class ExamTypeList extends Model {
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
        modelName: "ExamTypeList",
        tableName: "ExamTypeList",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.ExamTypeList.belongsTo(db.User, { foreignKey: "UserId" });
    db.ExamTypeList.hasMany(db.ExamPaperList, {
      foreignKey: "ExamTypeListId",
      onDelete: "CASCADE",
    });
  }
};
