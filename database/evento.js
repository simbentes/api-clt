const pool = require("../database/connection");
let evento = {};

evento.getAll = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.id_eventos AS id_evento, eventos.nome AS name, tipo_eventos.nome AS "tipo_eventos", id_tipo_eventos, descricao_curta AS "desc", fotos_eventos.foto AS "img", DATE(data_eventos.data) AS "date" FROM eventos INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND data_eventos.data > NOW() AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos GROUP BY data_eventos.ref_id_eventos) ORDER BY data_eventos.data ASC`,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

evento.getByType = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.id_eventos AS id_evento, eventos.nome AS name, tipo_eventos.nome AS "tipo_eventos", id_tipo_eventos, descricao_curta AS "desc", fotos_eventos.foto AS "img", DATE(data_eventos.data) AS "date" FROM eventos INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND data_eventos.data > NOW() AND tipo_eventos.id_tipo_eventos = ? AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos GROUP BY data_eventos.ref_id_eventos)`,
      id,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

evento.getSaved = (uid) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.id_eventos AS id_evento, eventos.nome AS name, eventos.descricao_curta AS "desc", fotos_eventos.foto AS "img", DATE(data_eventos.data) AS "date" FROM eventos LEFT JOIN guardados_vou ON guardados_vou.ref_id_eventos = eventos.id_eventos INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos INNER JOIN artistas ON artistas.id_artistas = eventos.ref_id_artistas INNER JOIN utilizadores ON utilizadores.id_utilizadores = guardados_vou.ref_id_utilizadores WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos WHERE data_eventos.data > NOW() GROUP BY data_eventos.ref_id_eventos) AND guardados = 1 AND id_utilizadores = ? ORDER BY guardados_vou.timestamp_guardados DESC`,
      uid,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

evento.getevento = (uid, id_evento) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.nome, eventos.link_reserva, eventos.link_bilheteira, fotos_eventos.foto AS img, eventos.descricao_curta,  eventos.descricao, ficha_tecnica, lotacao, ref_id_tipo_preco, preco_desconto, preco_normal, tipo_eventos.nome, artistas.nome, artistas.id_artistas, guardados_vou.guardados AS guardado, guardados_vou.vou AS vou, duracao, classificacao_etaria FROM eventos LEFT JOIN guardados_vou ON guardados_vou.ref_id_eventos = eventos.id_eventos AND ref_id_utilizadores = ? INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos INNER JOIN artistas ON artistas.id_artistas = eventos.ref_id_artistas WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos WHERE data_eventos.data > NOW() AND id_eventos = ? GROUP BY data_eventos.ref_id_eventos) ORDER BY data_eventos.data DESC;`,
      [uid, id_evento],
      (err, rows) => {
        if (err) return reject(err);
        console.log(rows);
        return resolve(rows);
      }
    );
  });
};

evento.getDatasEvento = (id_evento) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT data_eventos.data FROM data_eventos INNER JOIN eventos ON eventos.id_eventos = data_eventos.ref_id_eventos WHERE eventos.id_eventos = ? ORDER BY data_eventos.data ASC`,
      [id_evento],
      (err, rows) => {
        if (err) return reject(err);
        console.log(rows);
        return resolve(rows);
      }
    );
  });
};

evento.getVou = (id_evento) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT COUNT(vou) as count_vou FROM guardados_vou WHERE vou = 1 AND guardados_vou.ref_id_eventos = ?`,
      [id_evento],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

evento.getPub = (uid, id_evento, lastId, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id_publicacoes AS id_pub, texto AS title, foto AS img, id_utilizadores AS id_user, CONCAT(utilizadores.nome, ' ', apelido) AS "name", utilizadores.foto_perfil, UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(publicacoes.timestamp) AS time, gostos.ref_id_utilizadores AS "like" FROM publicacoes INNER JOIN utilizadores ON id_utilizadores = ref_id_utilizadores LEFT JOIN pub_associadas_eventos on pub_associadas_eventos.ref_id_publicacoes = id_publicacoes LEFT JOIN seguidores ON seguidores.ref_id_utilizadores_seguir = id_utilizadores AND seguidores.ref_id_utilizadores = ? LEFT JOIN gostos ON gostos.ref_id_publicacoes = id_publicacoes AND gostos.ref_id_utilizadores = ? WHERE pub_associadas_eventos.ref_id_eventos = ? AND id_publicacoes < ? ORDER BY publicacoes.timestamp DESC LIMIT 0, ?`,
      [uid, uid, id_evento, lastId, limit],
      (err, rows) => {
        if (err) return reject(err);
        console.log(rows);
        return resolve(rows);
      }
    );
  });
};

evento.getFotos = (id_evento) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT foto AS url FROM fotos_eventos INNER JOIN eventos ON eventos.id_eventos = fotos_eventos.ref_id_eventos WHERE id_eventos = ?;`,
      [id_evento],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

evento.getRandom = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.id_eventos AS id, eventos.nome as "title", fotos_eventos.foto AS "img", tipo_eventos.nome AS "event_type" FROM eventos INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos WHERE data_eventos.data > NOW() GROUP BY data_eventos.ref_id_eventos) ORDER BY RAND() LIMIT 1;`,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

evento.getVou = (idEvento) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT COUNT(vou) AS vou FROM guardados_vou WHERE vou = 1 AND guardados_vou.ref_id_eventos = ?`, idEvento, (err, rows) => {
      if (err) return reject(err);

      return resolve(rows);
    });
  });
};

evento.getVouGuardar = (uid, idEvento) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT ref_id_utilizadores FROM guardados_vou WHERE ref_id_utilizadores = ? AND ref_id_eventos = ?`,
      [uid, idEvento],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

evento.setVou = (uid, idEvento, action) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO guardados_vou (vou,ref_id_utilizadores,ref_id_eventos,timestamp_vou) VALUES (?,?,?,CURRENT_TIMESTAMP)`,
      [action, uid, idEvento],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

evento.setGuardar = (uid, idEvento, action) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO guardados_vou (guardados,ref_id_utilizadores,ref_id_eventos,timestamp_guardados) VALUES (?,?,?,CURRENT_TIMESTAMP)`,
      [action, uid, idEvento],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

evento.updateVou = (uid, idEvento, action) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE guardados_vou SET vou = ?,timestamp_vou = CURRENT_TIMESTAMP WHERE ref_id_utilizadores = ? AND ref_id_eventos = ?`,
      [action, uid, idEvento],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

evento.updateGuardar = (uid, idEvento, action) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE guardados_vou SET guardados = ?,timestamp_guardados = CURRENT_TIMESTAMP WHERE ref_id_utilizadores = ? AND ref_id_eventos = ?`,
      [action, uid, idEvento],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

evento.selectEventos = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.id_eventos FROM eventos INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos WHERE (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos WHERE data_eventos.data > NOW() GROUP BY data_eventos.ref_id_eventos);`,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

module.exports = evento;
