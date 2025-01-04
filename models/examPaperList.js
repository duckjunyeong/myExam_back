const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class ExamPaperList extends Model {
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
        modelName: "ExamPaperList",
        tableName: "ExamPaperList",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.ExamPaperList.belongsTo(db.ExamTypeList, {
      foreignKey: "ExamTypeListId",
    });

    db.ExamPaperList.hasMany(db.ExamPaper, {
      foreignKey: "ExamPaperListId",
      onDelete: "CASCADE",
    });
    db.ExamPaperList.hasMany(db.ExamResult, {
      foreignKey: "ExamPaperListId",
      onDelete: "CASCADE",
    });
  }
};
