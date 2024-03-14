import type { ComponentConfig, ThemeConfig } from "./types";

const getColor = (obj: object, path: string[], fallback: string): string => {
  if (path.length === 0 || !Object.prototype.hasOwnProperty.call(obj, path[0]))
    return fallback;

  const value = obj[path[0] as keyof typeof obj];
  if (typeof value === "string") return value;
  return getColor(value, path.slice(1), fallback);
};

const extractColors = (baseTheme: ThemeConfig["colors"], obj: object) => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (typeof value === "string")
        acc[key] = getColor(baseTheme, value.split("."), value);
      else acc[key] = extractColors(baseTheme, value);
      return acc;
    },
    {} as Record<string, unknown>
  );
};

export const generateTheme = (
  baseTheme: ThemeConfig,
  componentConfig: ComponentConfig
) => {
  const { colors, ...rest } = baseTheme;
  return {
    ...rest,
    colors: {
      ...colors,
      ...extractColors(colors, componentConfig),
    },
  };
};
