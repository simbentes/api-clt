const pool = require('../database/connection');
let pub = {};

pub.getAll = (uid, lastId, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id_publicacoes AS id_pub, texto AS title, foto AS img, id_utilizadores AS id_user, CONCAT(utilizadores.nome, ' ', apelido) AS "name", utilizadores.foto_perfil, UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(publicacoes.timestamp) AS time, gostos.ref_id_utilizadores AS "like" FROM publicacoes INNER JOIN utilizadores ON id_utilizadores = ref_id_utilizadores LEFT JOIN seguidores ON seguidores.ref_id_utilizadores_seguir = id_utilizadores AND seguidores.ref_id_utilizadores = ? LEFT JOIN gostos ON gostos.ref_id_publicacoes = id_publicacoes AND gostos.ref_id_utilizadores = ? WHERE id_publicacoes < ? ORDER BY publicacoes.id_publicacoes DESC LIMIT 0,?`,
      [uid, uid, lastId, limit],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      },
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
      },
    );
  });
};

pub.getEvent_profile = (lastId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id_publicacoes AS id_pub, id_eventos, nome FROM eventos INNER JOIN pub_associadas_eventos ON id_eventos = ref_id_eventos INNER JOIN publicacoes ON ref_id_publicacoes = id_publicacoes WHERE id_publicacoes < ? ORDER BY publicacoes.timestamp DESC LIMIT 0,3`,
      lastId,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      },
    );
  });
};

pub.getEvent_event = (idEvento, lastId, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id_publicacoes AS id_pub, id_eventos, nome FROM eventos INNER JOIN pub_associadas_eventos ON id_eventos = ref_id_eventos INNER JOIN publicacoes ON ref_id_publicacoes = id_publicacoes WHERE pub_associadas_eventos.ref_id_eventos = ? AND id_publicacoes < ? ORDER BY publicacoes.timestamp DESC LIMIT 0, ?`,
      [idEvento, lastId, limit],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      },
    );
  });
};

pub.getEvent_user = (uid, lastId, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id_publicacoes AS id_pub, id_eventos, eventos.nome FROM eventos INNER JOIN pub_associadas_eventos ON id_eventos = ref_id_eventos INNER JOIN publicacoes ON ref_id_publicacoes = id_publicacoes INNER JOIN utilizadores ON utilizadores.id_utilizadores = publicacoes.ref_id_utilizadores WHERE utilizadores.id_utilizadores = ? AND id_publicacoes < ? ORDER BY publicacoes.timestamp DESC LIMIT 0, ?`,
      [uid, lastId, limit],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      },
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
      },
    );
  });
};

pub.like = (uid, idPub) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO gostos (ref_id_utilizadores, ref_id_publicacoes) VALUES (?, ?)`,
      [uid, idPub],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      },
    );
  });
};

pub.dont_like = (uid, idPub) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `DELETE FROM gostos WHERE gostos.ref_id_utilizadores = ? AND gostos.ref_id_publicacoes = ?`,
      [uid, idPub],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      },
    );
  });
};

pub.send = (txt, filename, uid) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO publicacoes ( texto, foto, ref_id_utilizadores) VALUES (?,?,?);`,
      [txt, filename, uid],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      },
    );
  });
};

pub.assocEvent = (evento, pub) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO pub_associadas_eventos (ref_id_eventos, ref_id_publicacoes) VALUES (?,?);`,
      [evento, pub],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      },
    );
  });
};

pub.getNotiTokenByPubID = (pub) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT notification_token FROM utilizadores WHERE id_utilizadores IN (SELECT ref_id_utilizadores FROM publicacoes WHERE id_publicacoes = ?);`,
      pub,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      },
    );
  });
};

pub.eliminarGostosComentarios = (pub) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `DELETE FROM gostos_comentarios WHERE ref_id_comentarios IN (SELECT id_comentarios FROM comentarios WHERE ref_id_publicacoes = ?)`,
      pub,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      },
    );
  });
};

pub.eliminarComentarios = (pub) => {
  return new Promise((resolve, reject) => {
    pool.query(`DELETE FROM comentarios WHERE ref_id_publicacoes = ?`, pub, (err, rows) => {
      if (err) return reject(err);

      return resolve(rows);
    });
  });
};

pub.eliminarGostos = (pub) => {
  return new Promise((resolve, reject) => {
    pool.query(`DELETE FROM gostos WHERE ref_id_publicacoes = ?;`, pub, (err, rows) => {
      if (err) return reject(err);

      return resolve(rows);
    });
  });
};

pub.eliminarEventosPub = (pub) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `DELETE FROM pub_associadas_eventos WHERE ref_id_publicacoes = ?;`,
      pub,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      },
    );
  });
};

pub.eliminarPub = (pub) => {
  return new Promise((resolve, reject) => {
    pool.query(`DELETE FROM publicacoes WHERE id_publicacoes = ?;`, pub, (err, rows) => {
      if (err) return reject(err);

      return resolve(rows);
    });
  });
};

module.exports = pub;
