import gloabalErrorHandler from "../utils/globalErrorHandler.js";
export const errorLogger = (err, req, res, next) => {
  console.err("Error Logged :", err);
  gloabalErrorHandler(err, req, res, next);
};
