import { FlaskRound, Layout, Settings, Wallet } from "lucide-react";

export const SIDEBAR_LIST = [
  {
    name: "Application",
    items: [
      {
        name: "Labs",
        icons: FlaskRound,
        href: "/app/labs",
      },
      {
        name: "Workspaces",
        icons: Layout,
        href: "/app/workspaces",
      },
    ],
  },
  {
    name: "Account",
    items: [
      {
        name: "Billing",
        icons: Wallet,
        href: "/account/profile",
      },
      {
        name: "Settings",
        icons: Settings,
        href: "/account/settings",
      },
    ],
  },
];
