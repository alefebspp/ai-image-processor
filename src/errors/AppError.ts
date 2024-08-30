interface ErrorParams {
  message: string;
  statusCode: number;
  errorCode?: string
}

export class AppError extends Error {

    public statusCode: number;
    public errorCode: string;

  constructor({message, statusCode, errorCode}: ErrorParams) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    if(errorCode){
      this.errorCode = errorCode
    }
    Error.captureStackTrace(this, this.constructor);
  }
}