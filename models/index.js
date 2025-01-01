const Sequelize = require("sequelize");

const examList = require("./examList");
const examData = require("./examData");
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

db.ExamList = examList;
db.ExamData = examData;
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
