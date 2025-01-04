const Sequelize = require("sequelize");

const examTypeList = require("./examTypeList");
const examPaperList = require("./examPaperList");
const examPaper = require("./examPaper");
const examResult = require("./examResult");
const user = require("./user");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.passowrd,
  config
);

db.ExamTypeList = examTypeList;
db.ExamPaperList = examPaperList;
db.ExamPaper = examPaper;
db.ExamResult = examResult;

db.User = user;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
