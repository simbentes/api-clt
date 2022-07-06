const pool = require("../database/connection");
let comment = {};

comment.send = (uid, idPub, txt) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO comentarios (ref_id_utilizadores, ref_id_publicacoes, texto) VALUES (?, ?, ?)`,
      [uid, idPub, txt],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

comment.like = (uid, idComment) => {
  return new Promise((resolve, reject) => {
    pool.query(`INSERT INTO gostos_comentarios (ref_id_utilizadores, ref_id_comentarios) VALUES (?, ?)`, [uid, idComment], (err, rows) => {
      if (err) return reject(err);

      return resolve(rows);
    });
  });
};

comment.dont_like = (uid, idComment) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `DELETE FROM gostos_comentarios WHERE gostos_comentarios.ref_id_utilizadores = ? AND gostos_comentarios.ref_id_comentarios = ?`,
      [uid, idComment],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

module.exports = comment;
