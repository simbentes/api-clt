function getPaginationProps(query, sortField = 'title', searchField = 'title') {
  const { q, sort_by: sortBy = sortField, order_by: orderBy = 'asc', page = 0, limit = 10 } = query;

  const offset = +page * +limit;

  const params = {
    order: [[sortBy, orderBy]],
    offset,
    limit,
  };

  if (q) {
    params.where = {
      [searchField]: {
        [Op.like]: `%${q}%`,
      },
    };
  }

  return params;
}

module.exports = {
  getPaginationProps,
};
