const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class ExamResult extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        modelName: "ExamReulst",
        tableName: "ExamReulst",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.ExamResult.belongsTo(db.ExamPaperList, {
      foreignKey: "ExamPaperListId",
    });
  }
};
