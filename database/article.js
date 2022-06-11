const pool = require("./connection");
let article = {};

article.getPub = (page, limit, uid) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id_publicacoes AS id_pub, publicacoes.timestamp, texto, foto, id_utilizadores, CONCAT(utilizadores.nome, ' ', apelido), utilizadores.foto_perfil, UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(publicacoes.timestamp) AS tempo_pub, gostos.ref_id_utilizadores FROM publicacoes INNER JOIN utilizadores ON id_utilizadores = ref_id_utilizadores LEFT JOIN seguidores ON seguidores.ref_id_utilizadores_seguir = id_utilizadores AND seguidores.ref_id_utilizadores = ? LEFT JOIN gostos ON gostos.ref_id_publicacoes = id_publicacoes AND gostos.ref_id_utilizadores = ? ORDER BY publicacoes.timestamp DESC LIMIT ?, ?;`,
      [uid, uid, page, limit],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

article.getEvento = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.id_eventos, eventos.nome, fotos_eventos.foto, tipo_eventos.nome FROM eventos INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos WHERE data_eventos.data > NOW() GROUP BY data_eventos.ref_id_eventos) ORDER BY RAND() LIMIT 1;`,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

article.getMemoria = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.id_eventos, eventos.nome,  eventos.descricao_curta, fotos_eventos.foto FROM eventos INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND data_eventos.data < NOW() AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos GROUP BY data_eventos.ref_id_eventos) ORDER BY RAND() LIMIT 1;`,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

module.exports = article;
