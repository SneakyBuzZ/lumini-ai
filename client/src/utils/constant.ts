import { LabAISettings } from "@/lib/types/lab-type";

export const API_URL = import.meta.env.VITE_API_URL;

export const MODELS: Record<LabAISettings["apiService"], readonly string[]> = {
  gemini: ["gemini-1.5-flash", "gemini-1.5-pro"],
  openai: ["gpt-4o-mini", "gpt-4o"],
  anthropic: ["claude-3-haiku", "claude-3-sonnet"],
} as const;

export const TEMPERATURE_OPTIONS = ["0.2", "0.4", "0.5", "0.6", "0.7"] as const;

export const BASE_URLS: Record<LabAISettings["apiService"], string> = {
  gemini: "https://generativelanguage.googleapis.com/v1beta",
  openai: "https://api.openai.com/v1",
  anthropic: "https://api.anthropic.com",
};
