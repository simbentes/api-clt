const pool = require("../database/connection");
let pub = {};

pub.getAll = (uid, lastId, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id_publicacoes AS id_pub, texto AS title, foto AS img, id_utilizadores AS id_user, CONCAT(utilizadores.nome, ' ', apelido) AS "name", utilizadores.foto_perfil, UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(publicacoes.timestamp) AS time, gostos.ref_id_utilizadores AS "like" FROM publicacoes INNER JOIN utilizadores ON id_utilizadores = ref_id_utilizadores LEFT JOIN seguidores ON seguidores.ref_id_utilizadores_seguir = id_utilizadores AND seguidores.ref_id_utilizadores = ? LEFT JOIN gostos ON gostos.ref_id_publicacoes = id_publicacoes AND gostos.ref_id_utilizadores = ? WHERE id_publicacoes < ? ORDER BY publicacoes.timestamp DESC LIMIT 0,?`,
      [uid, uid, lastId, limit],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

pub.getEvent = (lastId) => {
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

pub.getComments = (uid, idPub) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id_comentarios AS id_comment, comentarios.texto AS "comment", id_utilizadores AS id_user, CONCAT(utilizadores.nome, ' ', apelido) AS "name", utilizadores.foto_perfil AS img, UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(comentarios.timestamp) AS "time", gostos_comentarios.ref_id_utilizadores AS "like" FROM comentarios INNER JOIN utilizadores ON id_utilizadores = ref_id_utilizadores INNER JOIN publicacoes on publicacoes.id_publicacoes = comentarios.ref_id_publicacoes LEFT JOIN seguidores ON seguidores.ref_id_utilizadores_seguir = id_utilizadores AND seguidores.ref_id_utilizadores = ? LEFT JOIN gostos_comentarios ON gostos_comentarios.ref_id_comentarios = id_comentarios AND gostos_comentarios.ref_id_utilizadores = ? WHERE id_publicacoes = ? ORDER BY comentarios.timestamp DESC`,
      [uid, uid, idPub],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

module.exports = pub;