import type { ColorProps, ComponentStyleConfig } from "@chakra-ui/react";

const dupStyleKeys = ["title", "container", "description"];

const generateVariantStyle = (
  variant: "honeydew" | "violet" | "success" | "warning" | "error"
) => {
  let mainColor: ColorProps["color"];
  let bgColor: ColorProps["color"];
  let borderColor: ColorProps["color"];

  switch (variant) {
    case "violet":
      mainColor = `${variant}.light`;
      bgColor = `${variant}.background`;
      borderColor = `${variant}.dark`;
      break;
    case "honeydew":
    case "error":
    default:
      mainColor = `${variant}.main`;
      borderColor = `${variant}.main`;
      bgColor = `${variant}.background`;
      break;
  }
  return Object.fromEntries(
    dupStyleKeys.map((key) => [
      key,
      {
        color: mainColor,
        ...(key === "container" && {
          bg: bgColor,
          borderColor: borderColor || mainColor,
        }),
      },
    ])
  );
};

export const Alert: ComponentStyleConfig = {
  baseStyle: {
    title: {
      color: "white",
      fontSize: "16px",
      fontWeight: 600,
      letterSpacing: "0.4px",
    },
    container: {
      bg: "pebble.800",
      border: "1px solid",
      borderRadius: "8px",
    },
    description: {
      fontSize: "14px",
      fontWeight: 400,
      letterSpacing: "0.1px",
    },
  },
  variants: {
    honeydew: generateVariantStyle("honeydew"),
    violet: generateVariantStyle("violet"),
    success: generateVariantStyle("success"),
    warning: generateVariantStyle("warning"),
    error: generateVariantStyle("error"),
  },
};
