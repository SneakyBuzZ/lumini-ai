export class DataResponse {
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

export class ErrorResponse {
  statusCode: number;
  messages: { message: string }[] | string;
  success: "Success" | "Failure";

  constructor(statusCode: number, messages: { message: string }[] | string) {
    this.statusCode = statusCode;
    this.messages = messages;
    this.success = statusCode < 400 ? "Success" : "Failure";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
