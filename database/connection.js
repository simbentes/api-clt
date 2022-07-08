const mysql = require("mysql");
require("dotenv").config();

const pool = mysql.createPool({
  host: "165.227.232.115",
  user: "root",
  password: "jasdnljksadfnaljsbgsfg3i42h_42h!34jb23!#DDb2_JBJHDBB",
  database: "clt",
  charset: "utf8mb4",
});

module.exports = pool;
