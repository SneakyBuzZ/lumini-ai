export class ApiError extends Error {
  statusCode: number;
  message: string;
  error?: string;

  constructor(statusCode: number, message = "Someting went wrong", error = "") {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}

export class ApiResponse {
  statusCode: number;
  message: string;
  payload: null | {};
  success: "Success" | "Failure";

  constructor(statusCode: number, payload: {}, message = "Success") {
    this.statusCode = statusCode;
    this.message = message;
    this.payload = payload;
    this.success = statusCode < 400 ? "Success" : "Failure";
  }
}
