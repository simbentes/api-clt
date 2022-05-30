const express = require("express");
const router = express.Router();
const db = require("../database");
const { success } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");

router.get("/", async (req, res) => {
  const { page = 0, limit = 4 } = req.query;

  const offset = +page * +limit;
  // page 0, limit 10 = start 0, end 10
  // page 1, limit 10 = start 10, end 20

  try {
    let res_memoria = await db.memoria.getAll(page, limit);
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
});

module.exports = router;
