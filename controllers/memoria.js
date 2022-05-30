const { success } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");
const { memoria } = require("../database");

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

const ArticleController = {
  getAll,
};

module.exports = ArticleController;
