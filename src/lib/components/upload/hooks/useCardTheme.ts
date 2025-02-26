import type { Option } from "lib/types";
import type { CardTheme, Status } from "../types";

export const useCardTheme = (theme: CardTheme, status: Option<Status>) => {
  const getTheme = () => {
    if (theme === "gray")
      return {
        bgColor: "gray.800",
        border: "1px solid var(--chakra-colors-gray-700)",
      };

    return {
      bgColor: "gray.900",
      border: "1px solid var(--chakra-colors-gray-900)",
    };
  };

  const resolveStatusColor = () => {
    switch (status) {
      case "error":
        return "error.main";
      case "info":
        return "primary.main";
      default:
        return undefined;
    }
  };

  return {
    themeConfig: getTheme(),
    statusColor: resolveStatusColor(),
  };
};
