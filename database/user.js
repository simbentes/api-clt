const pool = require("./connection");
let user = {};

user.register = (nome, apelido, username, email, password) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO utilizadores (nome, apelido, email, password, foto_perfil) VALUES (?,?,?,?,'default.webp')`,
      [nome, apelido, email, password],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

module.exports = user;
