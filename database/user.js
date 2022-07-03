const pool = require("./connection");
let user = {};

user.register = (nome, apelido, email, password) => {
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

user.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT utilizadores.id_utilizadores AS uid, utilizadores.password FROM `utilizadores` WHERE email = ?",
      [email],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

module.exports = user;
