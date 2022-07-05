const pool = require("../database/connection");
const memoria = require("../database/memoria");
const article = require("../database/article");
const user = require("../database/user");
const evento = require("../database/evento");
const pub = require("../database/pub");

const db = { memoria, article, user, evento, pub };

module.exports = db;
