export class ErrorResponse {
  statusCode: number;
  messages: { message: string }[] | string;
  success: "Success" | "Failure";

  constructor(statusCode: number, messages: { message: string }[] | string) {
    this.statusCode = statusCode;
    this.messages = messages;
    this.success = statusCode < 400 ? "Success" : "Failure";
  }
}
