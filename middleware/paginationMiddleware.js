import { paginate } from "../utils/pagination.util.js";

export const paginationMiddleware = (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // If a query object exists in req.query, apply pagination to it
    if (req.query.query) {
      req.query.query = paginate(req.query.query, parseInt(page, 10), parseInt(limit, 10));
    }

    req.pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10) };
    next();
  } catch (err) {
    next(err);
  }
};
