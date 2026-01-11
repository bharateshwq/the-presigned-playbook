const DAISY_THEME = ["business", "retro", "system"] as const;
export type DaisyTheme = (typeof DAISY_THEME)[number];

export const STORAGE_KEY = "theme";

export function saveTheme(theme: DaisyTheme | "system") {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  const themeCookie = `theme=${theme}; path=/; expires=${d.toUTCString()}; SameSite=Lax`;
  document.cookie = themeCookie;
}
