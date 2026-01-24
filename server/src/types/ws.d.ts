import * as _ from "ws";

declare module "ws" {
  interface WebSocket {
    user?: {
      id: string;
    };
    labId?: string;
    color?: string;
  }
}
