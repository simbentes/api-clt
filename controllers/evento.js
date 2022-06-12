const { success } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");
const { evento } = require("../database");

const getAll = async (req, res) => {
  let { page = 0, limit = 4 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const offset = +page * +limit;
  // page 0, limit 10 = start 0, end 10
  // page 1, limit 10 = start 10, end 20

  try {
    let res_evento = await evento.getAll(page, limit);
    res.json(
      success(res_evento, {
        limit,
        currentPage: page,
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const getEvento = async (req, res) => {
  const { idEvento } = req.params;

  try {
    let res_evento = await evento.getevento(idEvento);
    res.json(
      success(res_evento, {
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
  getEvento,
};

module.exports = ArticleController;
