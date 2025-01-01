require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "myexam",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
