const pool = require("../database/connection");
let pub = {};

pub.getAll = (lastId, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id_publicacoes AS id_pub, texto AS title, foto AS img, id_utilizadores AS id_user, CONCAT(utilizadores.nome, ' ', apelido) AS "name", utilizadores.foto_perfil, UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(publicacoes.timestamp) AS time, gostos.ref_id_utilizadores AS "like" FROM publicacoes INNER JOIN utilizadores ON id_utilizadores = ref_id_utilizadores LEFT JOIN seguidores ON seguidores.ref_id_utilizadores_seguir = id_utilizadores AND seguidores.ref_id_utilizadores = 1 LEFT JOIN gostos ON gostos.ref_id_publicacoes = id_publicacoes AND gostos.ref_id_utilizadores = 1 WHERE id_publicacoes < ? ORDER BY publicacoes.timestamp DESC LIMIT 0,3`,
      [lastId],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

pub.getEvent = (lastId, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id_publicacoes AS id_pub, id_eventos, nome FROM eventos INNER JOIN pub_associadas_eventos ON id_eventos = ref_id_eventos INNER JOIN publicacoes ON ref_id_publicacoes = id_publicacoes WHERE id_publicacoes < ? ORDER BY publicacoes.timestamp DESC LIMIT 0,3`,
      lastId,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

pub.getComments = (lastId, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(``, [lastId, limit], (err, rows) => {
      if (err) return reject(err);

      return resolve(rows);
    });
  });
};

module.exports = pub;
