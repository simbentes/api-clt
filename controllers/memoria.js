const { success } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");
const { memoria, evento } = require("../database");

const getAll = async (req, res) => {
  let { page = 0, limit = 4 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const offset = +page * +limit;
  // page 0, limit 10 = start 0, end 10
  // page 1, limit 10 = start 10, end 20

  try {
    let res_memoria = await memoria.getAll(page, limit);
    res.json(
      success(res_memoria, {
        limit,
        currentPage: page,
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const getMemoria = async (req, res) => {
  const { idEvento } = req.params;

  try {
    let res_memoria = await memoria.getMemoria(idEvento);
    res.json(
      success(res_memoria, {
        limit: 1,
        currentPage: 0,
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const getPub = async (req, res) => {
  const { uid } = req;
  const { idEvento } = req.params;

  try {
    let res_memoria = await evento.getPub(idEvento, uid);
    res.json(
      success(res_memoria, {
        limit: 1,
        currentPage: 0,
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const ArticleController = {
  getAll,
  getMemoria,
  getPub,
};

module.exports = ArticleController;
