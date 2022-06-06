const pool = require("../database/connection");
const memoria = require("../database/memoria");
const article = require("../database/article");

const db = { memoria, article };

module.exports = db;
