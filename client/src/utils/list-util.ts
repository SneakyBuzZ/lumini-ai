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

export const BillingList = [
  {
    plan: "free",
    planLabel: "Free Plan",
    planStatus: "Current",
    price: "$0",
    ctaLabel: null,
    buttonType: "outline",
    features: [
      "1 Free Workspace Only",
      "3 Free Labs Only",
      "Limited whiteboard Features",
      "Limited Lab Storage",
      "Limited AI Querying",
    ],
    endingPara:
      "Try our freemium plan to explore our application. Upgrade to Pro or Enterprise for more advanced features and support.",
  },
  {
    plan: "pro",
    planLabel: "Pro Plan",
    planStatus: "Popular",
    price: "$29",
    ctaLabel: "Upgrade to Pro",
    buttonType: "default",
    features: [
      "Up to 3 Workspaces",
      "5 Labs per Workspace",
      "All Whiteboard Features",
      "Advanced Analytics",
      "Collaborate with Others",
      "Improve Lab Storage",
      "Better AI Querying",
    ],
    endingPara:
      "Try our Pro plan to explore all features. Upgrade to Enterprise for more advanced features and support.",
  },
  {
    plan: "enterprise",
    planLabel: "Enterprise Plan",
    planStatus: "Beast",
    price: "$99",
    ctaLabel: "Upgrade to Enterprise",
    buttonType: "secondary",
    features: [
      "Unlimited Workspaces",
      "Unlimited Labs per Workspace",
      "All Whiteboard Features",
      "Advanced Analytics",
      "Collaborate with Others",
      "Unlimited Lab Storage",
      "Unlimited AI Querying",
      "Priority Support",
      "External Integrations",
      "Dedicated Account Manager",
    ],
    endingPara:
      "Try our Enterprise plan to explore all features. Contact us for more information on custom solutions and support.",
  },
];

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
    id: 1,
    label: "Home",
    href: "/",
  },
  {
    id: 2,
    label: "Labs",
    href: "/labs",
  },
  {
    id: 3,
    label: "Workspaces",
    href: "/workspaces",
  },
  {
    id: 4,
    label: "Settings",
    href: "/settings",
  },
  {
    id: 5,
    label: "Profile",
    href: "/profile",
  },
  {
    id: 6,
    label: "Billing",
    href: "/billing",
  },
];

export const SIDEBAR_LIST = [
  {
    name: "Application",
    items: [
      {
        name: "Labs",
        icons: FlaskRound,
        href: "/app",
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
