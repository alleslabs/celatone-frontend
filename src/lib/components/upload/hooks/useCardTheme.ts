import type { CardTheme, Status } from "../types";
import type { Option } from "lib/types";

export const useCardTheme = (theme: CardTheme, status: Option<Status>) => {
  const getTheme = () => {
    if (theme === "gray")
      return {
        bgColor: "gray.800",
        border: "1px solid var(--chakra-colors-gray-700)",
        buttonVariant: "outline-gray",
      };

    return {
      bgColor: "gray.900",
      border: "1px solid var(--chakra-colors-gray-900)",
      buttonVariant: "outline-primary",
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
    statusColor: resolveStatusColor(),
    themeConfig: getTheme(),
  };
};
