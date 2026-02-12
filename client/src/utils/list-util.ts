import {
  Book,
  Bot,
  FlaskRound,
  FolderGit2,
  Layout,
  Settings,
  Wallet,
} from "lucide-react";

import { SiInstagram, SiLinkedin, SiX } from "react-icons/si";

export const FOOTER_LISTS = [
  {
    id: 1,
    title: "Popular",
    subMenu: [
      {
        id: 1,
        name: "javascript",
        route: "/",
      },
      {
        id: 2,
        name: "react",
        route: "/docs",
      },
      {
        id: 3,
        name: "nextjs",
        route: "/docs/nextjs",
      },
      {
        id: 4,
        name: "tailwindcss",
        route: "/docs/tailwindcss",
      },
    ],
  },
  {
    id: 2,
    title: "Nxtgen",
    subMenu: [
      {
        id: 1,
        name: "What is Nxtgen?",
        route: "/docs/getting-started",
      },
      {
        id: 2,
        name: "why Nxtgen?",
        route: "/docs/api",
      },
      {
        id: 3,
        name: "How to contribute?",
        route: "/docs/contribute",
      },
    ],
  },
  {
    id: 3,
    title: "Community",
    subMenu: [
      {
        id: 1,
        name: "GitHub",
        route: "https://github.com",
      },
      {
        id: 3,
        name: "Twitter",
        route: "https://twitter.com",
      },
      {
        id: 7,
        name: "Instagram",
        route: "https://instagram.com",
      },
    ],
  },
  {
    id: 4,
    title: "Legal",
    subMenu: [
      {
        id: 1,
        name: "Privacy Policy",
        route: "/privacy",
      },
      {
        id: 2,
        name: "Terms of Service",
        route: "/terms",
      },
    ],
  },
];

export const NAVBAR_LIST = [
  {
    id: 2,
    label: "Platform",
    href: "/",
    children: [
      {
        id: 10,
        title: "Repo Whisperer",
        href: "/repo-whisperer",
        content:
          "Ask questions about your codebase and get instant answers with our AI-powered assistant.",
        icon: "/assets/icons/repo-whisperer.svg",
      },
      {
        id: 11,
        title: "Realtime Canvas",
        href: "/realtime-canvas",
        content:
          "Collaborate in real-time with our interactive canvas, designed for brainstorming and project planning.",
        icon: "/assets/icons/realtime-canvas.svg",
      },
      {
        id: 12,
        title: "Collaborative Workspace",
        href: "/collab-space",
        content:
          "Work together seamlessly with your team in a shared virtual workspace.",
        icon: "/assets/icons/collab-workspace.svg",
      },
      {
        id: 13,
        title: "Insightful Dashboard",
        href: "/insightful-dashboard",
        content:
          "Gain valuable insights into your projects with our powerful analytics tools.",
        icon: "/assets/icons/insightful-dashboard.svg",
      },
    ],
  },
  {
    id: 4,
    label: "Contact",
    href: "/",
    children: [
      {
        id: 30,
        title: "Linkedin",
        href: "/",
        content:
          "Connect with me on LinkedIn to stay updated on the latest news and insights.",
        icon: "/assets/icons/linkedin.svg",
      },
      {
        id: 31,
        title: "Github",
        href: "/",
        content:
          "Check out my GitHub repositories to see my projects and contributions.",
        icon: "/assets/icons/github.svg",
      },
      {
        id: 32,
        title: "X / Twitter",
        href: "/",
        content:
          "Follow me on X (formerly Twitter) for quick updates and thoughts.",
        icon: "/assets/icons/xtwitter.svg",
      },
    ],
  },
];

export const SIDEBAR_LIST = (workspaceId: string) => [
  {
    name: "Application",
    items: [
      {
        name: "Labs",
        icons: FlaskRound,
        href: `/dashboard/space/${workspaceId}`,
      },
      {
        name: "Team",
        icons: FlaskRound,
        href: `/dashboard/space/${workspaceId}/team`,
      },
    ],
  },
  {
    name: "Account",
    items: [
      {
        name: "Billing",
        icons: Wallet,
        href: `/dashboard/space/${workspaceId}/billing`,
      },
      {
        name: "Settings",
        icons: Settings,
        href: `/dashboard/space/${workspaceId}/general`,
      },
    ],
  },
];

export const LAB_SIDEBAR_LIST = (labId: string) => [
  {
    name: "Lab",
    items: [
      {
        name: "Overview",
        icons: Layout,
        href: `/dashboard/lab/${labId}`,
      },
      {
        name: "Ask Your Repo",
        icons: Bot, // choose your AI icon
        href: `/dashboard/lab/${labId}/ask`,
      },
      {
        name: "Files & Context",
        icons: FolderGit2, // or FileCode
        href: `/dashboard/lab/${labId}/files`,
      },
      {
        name: "Canvas",
        icons: Book,
        href: `/dashboard/lab/${labId}/canvas`,
      },
      {
        name: "Settings",
        icons: Settings,
        href: `/dashboard/lab/${labId}/settings`,
      },
    ],
  },
];

export const SOCIAL_LISTS = [
  {
    id: 2,
    url: "https://www.twitter.com",
    component: SiX,
  },
  {
    id: 3,
    url: "https://www.linkedin.com",
    component: SiLinkedin,
  },
  {
    id: 4,
    url: "https://www.instagram.com",
    component: SiInstagram,
  },
];
