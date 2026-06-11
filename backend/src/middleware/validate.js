import { AppError } from "../utils/AppError.js";

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return next(
      new AppError(
        "Validation failed",
        422,
        result.error.errors.map((error) => ({
          path: error.path.join("."),
          message: error.message,
        })),
      ),
    );
  }

  req.validated = result.data;
  return next();
};