const pool = require("../database/connection");
let memoria = {};

memoria.getAll = (page, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.id_eventos AS id_evento, eventos.nome AS name, eventos.descricao_curta AS "desc", fotos_eventos.foto AS "img", DATE(data_eventos.data) AS "date" FROM eventos INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND data_eventos.data < NOW() AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos GROUP BY data_eventos.ref_id_eventos) ORDER BY data_eventos.data DESC LIMIT ?, ?;`,
      [page, limit],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

memoria.getMemoria = (id_evento) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.nome, fotos_eventos.foto AS img, DATE(data_eventos.data) AS "data", descricao_curta AS desc_curta, eventos.descricao AS "desc", id_artistas AS id_artista, artistas.nome AS artista FROM eventos INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos INNER JOIN artistas ON artistas.id_artistas = eventos.ref_id_artistas WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND eventos.id_eventos = ? AND data_eventos.data < NOW() AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos GROUP BY data_eventos.ref_id_eventos) ORDER BY data_eventos.data DESC;`,
      id_evento,
      (err, rows) => {
        if (err) return reject(err);
        console.log(rows);
        return resolve(rows);
      }
    );
  });
};

module.exports = memoria;
