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

// NEW sidebar list to show when inside a specific lab
export const LAB_SIDEBAR_LIST = (labId: string) => [
  {
    name: "Lab",
    items: [
      {
        name: "Overview",
        icons: Layout,
        href: `/app/labs/${labId}`,
      },
      {
        name: "Ask Your Repo",
        icons: Bot, // choose your AI icon
        href: `/app/labs/${labId}/ask`,
      },
      {
        name: "Files & Context",
        icons: FolderGit2, // or FileCode
        href: `/app/labs/${labId}/files`,
      },
      {
        name: "Whiteboard",
        icons: Book,
        href: `/app/labs/${labId}/whiteboard`,
      },
      {
        name: "Settings",
        icons: Settings,
        href: `/app/labs/${labId}/settings`,
      },
    ],
  },
];
