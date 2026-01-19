import * as _ from "ws";

declare module "ws" {
  namespace WebSocket {
    interface WebSocket {
      user?: {
        id: string;
      };
      labId?: string;
    }
  }
}
