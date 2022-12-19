class AppError extends Error {
  path: any;
  value: any;
  errors?(errors: any) {
    throw new Error('Method not implemented.');
  }
  statusCode: number;
  code?: number;
  status: string;
  isOperational: boolean;
  keyValue?: { email: 'string' };
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
