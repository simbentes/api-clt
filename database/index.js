const pool = require("../database/connection");
const memoria = require("../database/memoria");
const article = require("../database/article");
const user = require("../database/user");

const db = { memoria, article, user };

module.exports = db;
