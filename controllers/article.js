const { success } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");
const { article } = require("../database");

const pubAleatoria = () => {
  let arraypubs = [];

  if (Math.floor(Math.random() * 2 + 2) == 3) {
    arraypubs.push(false);
  } else {
    arraypubs.push(true);
  }

  if (arraypubs[0] == false) {
    let nAleatorio = Math.random();

    // memoria ou pub
    // existe 50% de probabilidade de calhar uma memória ou evento, depois
    if (nAleatorio > 0.5) {
      arraypubs.push(true);
      arraypubs.push(false);
    } else {
      arraypubs.push(false);
      arraypubs.push(true);
    }
  } else {
    arraypubs.push(false);
    arraypubs.push(false);
  }

  return arraypubs;
};

const getAll = async (req, res) => {
  let { page = 0, uid = 1 } = req.query;
  let limit = 0;
  page = parseInt(page);

  const offset = +page * +limit;
  // page 0, limit 10 = start 0, end 10
  // page 1, limit 10 = start 10, end 20

  try {
    let config = pubAleatoria();

    if (config[0]) {
      limit = 3;
    } else {
      limit = 2;
    }

    let res_pub = await article.getPub(page, limit, uid);
    let res_evento = [];
    let res_memoria = [];

    if (config[1]) {
      res_evento = await article.getEvento();
    }

    if (config[2]) {
      res_memoria = await article.getMemoria();
    }

    let res_article = [...res_pub, ...res_evento, ...res_memoria];

    res.json(
      success(res_article, {
        limit,
        currentPage: page,
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const ArticleController = {
  getAll,
};

module.exports = ArticleController;
