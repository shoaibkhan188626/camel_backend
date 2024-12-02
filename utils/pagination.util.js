/**
 * Applies pagination to a database query.
 * @param {Object} query - The database query object.
 * @param {number} page - Current page number.
 * @param {number} limit - Number of items per page.
 * @returns {Object} The paginated query.
 */
const paginate = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

export { paginate };
