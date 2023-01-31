import type { ComponentStyleConfig } from "@chakra-ui/react";

const honeydewMain = "honeydew.main";
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
    honeydew: {
      title: {
        color: honeydewMain,
        fontSize: "16px",
        fontcolor: honeydewMain,
        fontWeight: 600,
        letterSpacing: "0.4px",
      },
      container: {
        bg: "rgba(#C6E141,0.2)",
        border: "1px solid",
        borderColor: honeydewMain,
        borderRadius: "4px",
        color: honeydewMain,
      },
      description: {
        fontSize: "12px",
        fontWeight: 400,
        letterSpacing: "0.1px",
      },
    },
  },
};
