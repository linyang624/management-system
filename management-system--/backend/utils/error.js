export default function errorHandler(err, req, res, next) {
  return res.status(err.statusCode ?? 500).json({ message: err.message });
}

export class ValidationError extends Error {

  constructor(message) {

    super(message);

    this.name = 'ValidationError';

    this.statusCode = 400;

  }

}