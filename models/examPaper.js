const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class ExamPaper extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
        },
        choice: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        correct: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
      },
      {
        modelName: "ExamPaper",
        tableName: "ExamPaper",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.ExamPaper.belongsTo(db.ExamPaperList, { foreignKey: "ExamPaperListId" });
  }
};
