const pool = require("../database/connection");
let article = {};

article.getEvento = (id_evento) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.nome, ficha_tecnica, fotos_eventos.foto, DATE(data_eventos.data) AS "data", descricao_curta, eventos.descricao, classificacao_etaria, duracao, id_artistas AS id_artista, artistas.nome AS artista FROM eventos INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos INNER JOIN artistas ON artistas.id_artistas = eventos.ref_id_artistas WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND eventos.id_eventos = ? AND data_eventos.data < NOW() AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos GROUP BY data_eventos.ref_id_eventos) ORDER BY data_eventos.data DESC;`,
      [id_evento],
      (err, rows) => {
        if (err) return reject(err);
        console.log(rows);
        return resolve(rows);
      }
    );
  });
};

article.getMemoria = (id_evento) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.nome, ficha_tecnica, fotos_eventos.foto, DATE(data_eventos.data) AS "data", descricao_curta, eventos.descricao, classificacao_etaria, duracao, id_artistas AS id_artista, artistas.nome AS artista FROM eventos INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos INNER JOIN artistas ON artistas.id_artistas = eventos.ref_id_artistas WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND eventos.id_eventos = ? AND data_eventos.data < NOW() AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos GROUP BY data_eventos.ref_id_eventos) ORDER BY data_eventos.data DESC;`,
      [id_evento],
      (err, rows) => {
        if (err) return reject(err);
        console.log(rows);
        return resolve(rows);
      }
    );
  });
};

module.exports = article;
