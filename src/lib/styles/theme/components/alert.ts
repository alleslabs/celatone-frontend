import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Alert: ComponentStyleConfig = {
  baseStyle: {
    title: {
      color: "white",
    },
    container: {
      bg: "gray.800",
    },
  },
  variants: {
    info: {
      title: {
        color: "info.main",
        fontSize: "16px",
        fontWeight: 600,
        letterSpacing: "0.4px",
      },
      container: {
        bg: "rgba(41,182,246,0.2)",
        border: "1px solid",
        borderColor: "info.main",
        borderRadius: "4px",
        color: "info.main",
      },
      description: {
        fontSize: "12px",
        fontWeight: 400,
        letterSpacing: "0.1px",
      },
    },
  },
};
