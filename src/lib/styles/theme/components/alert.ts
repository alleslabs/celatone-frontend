import type {
  BorderProps,
  ColorProps,
  ComponentStyleConfig,
} from "@chakra-ui/react";

const dupStyleKeys = ["title", "container", "description"];

const generateVariantStyle = (
  variant:
    | "error"
    | "info"
    | "info-left-secondary"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
) => {
  let mainColor: ColorProps["color"];
  let bgColor: ColorProps["color"];
  let borderColor: ColorProps["color"];
  let border: BorderProps["border"];
  let borderLeft: BorderProps["borderLeft"];
  let borderRadius: BorderProps["borderRadius"];

  switch (variant) {
    case "info":
      mainColor = "gray.400";
      bgColor = "gray.800";
      borderColor = "gray.700";
      break;
    case "info-left-secondary":
      bgColor = "background.main";
      border = "0";
      borderLeft = "3px solid";
      borderRadius = "0";
      break;
    case "primary":
      mainColor = `${variant}.light`;
      bgColor = `${variant}.background`;
      borderColor = `${variant}.dark`;
      break;
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
        border,
        borderRadius,
        color: mainColor,
        ...(key === "container" && {
          bg: bgColor,
          borderColor: borderColor || mainColor,
          borderLeft,
        }),
      },
    ])
  );
};

export const Alert: ComponentStyleConfig = {
  baseStyle: {
    container: {
      bg: "gray.800",
      border: "1px solid",
      borderRadius: "8px",
    },
    description: {
      fontSize: "14px",
      fontWeight: 400,
      letterSpacing: "0.1px",
    },
    title: {
      color: "text.main",
      fontSize: "16px",
      fontWeight: 600,
      letterSpacing: "0.4px",
    },
  },
  variants: {
    error: generateVariantStyle("error"),
    info: generateVariantStyle("info"),
    "info-left-secondary": generateVariantStyle("info-left-secondary"),
    primary: generateVariantStyle("primary"),
    success: generateVariantStyle("success"),
    warning: generateVariantStyle("warning"),
  },
};
