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
