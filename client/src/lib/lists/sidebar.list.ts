import {
  Book,
  Bot,
  FlaskRound,
  FolderGit2,
  Layout,
  Settings,
  Wallet,
} from "lucide-react";

export const SIDEBAR_LIST = [
  {
    name: "Application",
    items: [
      {
        name: "Labs",
        icons: FlaskRound,
        href: "/app/labs",
      },
    ],
  },
  {
    name: "Account",
    items: [
      {
        name: "Billing",
        icons: Wallet,
        href: "/app/billing",
      },
      {
        name: "Settings",
        icons: Settings,
        href: "/app/settings",
      },
    ],
  },
];

export const LAB_SIDEBAR_LIST = (labName: string) => [
  {
    name: "Lab",
    items: [
      {
        name: "Overview",
        icons: Layout,
        href: `/app/labs/${labName}`,
      },
      {
        name: "Ask Your Repo",
        icons: Bot, // choose your AI icon
        href: `/app/labs/${labName}/ask`,
      },
      {
        name: "Files & Context",
        icons: FolderGit2, // or FileCode
        href: `/app/labs/${labName}/files`,
      },
      {
        name: "Whiteboard",
        icons: Book,
        href: `/app/labs/${labName}/whiteboard`,
      },
      {
        name: "Settings",
        icons: Settings,
        href: `/app/labs/${labName}/settings`,
      },
    ],
  },
];
