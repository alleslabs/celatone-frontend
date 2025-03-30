import type { ComponentStyleConfig } from "@chakra-ui/react";
import { defineStyle } from "@chakra-ui/react";

const gray400 = "gray.400";
const gray500 = "gray.500";
const gray600 = "gray.600";
const gray700 = "gray.700";
const gray800 = "gray.800";
const primaryLight = "primary.light";
const primaryDark = "primary.dark";
const primaryDarker = "primary.darker";
const primaryBg = "primary.background";
const secondaryBg = "secondary.background";
const secondaryMain = "secondary.main";
const secondaryDarker = "secondary.darker";
const borderDefault = "1px solid";
const errorDark = "error.dark";
const buttonOutlinePrimaryColor = "button.outlinePrimary.color";

const generateStyle = ({
  basic,
  disabled,
  hoverBg,
  activeBg,
}: {
  basic: object;
  disabled: object;
  hoverBg: string;
  activeBg: string;
}) => {
  return defineStyle({
    ...basic,
    _hover: {
      background: hoverBg,
      _disabled: { ...disabled },
      _loading: { ...basic },
    },
    _disabled: { opacity: 1, ...disabled },
    _loading: { ...basic },
    _active: {
      background: activeBg,
    },
  });
};

export const Button: ComponentStyleConfig = {
  baseStyle: {
    display: "flex",
    flexDir: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    _active: {
      transform: "scale(0.98)",
    },
    boxShadow: "none",
    fontFamily: "heading",
    fontWeight: 600,
  },
  sizes: {
    sm: {
      fontSize: "12px",
      padding: "4px 10px",
      height: "30px",
      fontWeight: 600,
    },
    md: {
      fontSize: "14px",
      padding: "6px 16px",
      height: "36px",
      fontWeight: 600,
    },
  },
  variants: {
    primary: generateStyle({
      basic: {
        background: "button.primary.background",
        color: "button.primary.color",
        "& span": {
          color: "button.primary.color",
        },
      },
      disabled: {
        background: "button.primary.disabledBackground",
        color: "button.primary.disabledColor",
        "& span": {
          color: "button.primary.disabledColor",
        },
      },
      hoverBg: "button.primary.hoverBackground",
      activeBg: "button.primary.activeBackground",
    }),
    "gray-solid": generateStyle({
      basic: {
        background: gray800,
        color: "text.main",
      },
      disabled: {
        background: gray800,
        color: gray500,
      },
      hoverBg: gray700,
      activeBg: gray700,
    }),
    "white-solid": generateStyle({
      basic: {
        background: "#ffffff",
        color: "gray.900",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: 0,
      },
      disabled: {
        background: "gray.100",
        color: "gray.900",
      },
      hoverBg: "gray.100",
      activeBg: "gray.100",
    }),
    error: generateStyle({
      basic: { background: "error.main", color: "black" },
      disabled: {
        background: errorDark,
        color: "black",
      },
      hoverBg: errorDark,
      activeBg: "error.light",
    }),
    "outline-primary": generateStyle({
      basic: {
        border: borderDefault,
        borderColor: "button.outlinePrimary.borderColor",
        color: buttonOutlinePrimaryColor,
        "> div": {
          color: buttonOutlinePrimaryColor,
        },
        "& span": {
          color: buttonOutlinePrimaryColor,
        },
        "> svg": {
          color: buttonOutlinePrimaryColor,
        },
      },
      disabled: {
        border: borderDefault,
        borderColor: "button.outlinePrimary.disabledBorderColor",
        color: "button.outlinePrimary.disabledColor",
        "& span": {
          color: "button.outlinePrimary.disabledColor",
        },
      },
      hoverBg: "button.outlinePrimary.hoverBackground",
      activeBg: "button.outlinePrimary.activeBackground",
    }),
    "outline-gray": generateStyle({
      basic: {
        border: borderDefault,
        borderColor: gray600,
        color: "text.dark",
        "> svg": {
          color: "text.dark",
        },
      },
      disabled: {
        border: borderDefault,
        borderColor: gray700,
        color: gray600,
        "> svg": {
          color: gray600,
        },
      },
      hoverBg: gray700,
      activeBg: "transparent",
    }),
    "outline-white": generateStyle({
      basic: {
        border: borderDefault,
        borderColor: gray400,
        background: "background.main",
        color: "text.main",
        "> svg": {
          color: "text.main",
        },
      },
      disabled: {
        border: borderDefault,
        borderColor: gray600,
        color: gray600,
        "> svg": {
          color: gray600,
        },
      },
      hoverBg: gray700,
      activeBg: "transparent",
    }),
    "outline-secondary": generateStyle({
      basic: {
        border: borderDefault,
        borderColor: secondaryBg,
        color: secondaryMain,
        "> svg": {
          color: secondaryMain,
        },
      },
      disabled: {
        border: secondaryDarker,
        color: secondaryDarker,
        "> svg": {
          color: secondaryDarker,
        },
      },
      hoverBg: secondaryBg,
      activeBg: "transparent",
    }),
    "command-button": generateStyle({
      basic: {
        border: borderDefault,
        borderColor: primaryDark,
        color: "text.main",
      },
      disabled: {
        border: primaryDarker,
        color: primaryDarker,
      },
      hoverBg: primaryBg,
      activeBg: "transparent",
    }),
    "ghost-primary": generateStyle({
      basic: {
        color: primaryLight,
        "> svg": {
          color: "primaryLight",
        },
      },
      disabled: {
        color: primaryDark,
        "> svg": {
          color: primaryDark,
        },
      },
      hoverBg: primaryBg,
      activeBg: "transparent",
    }),
    "ghost-gray": generateStyle({
      basic: {
        color: "gray.400",
        "> svg": {
          color: "gray.400",
        },
      },
      disabled: {
        color: gray500,
        "> svg": {
          color: gray500,
        },
      },
      hoverBg: gray800,
      activeBg: "transparent",
    }),
    "ghost-white": generateStyle({
      basic: {
        color: "gray.300",
        "> svg": {
          color: "gray.300",
        },
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: 0,
      },
      disabled: {
        color: gray500,
        "> svg": {
          color: gray500,
        },
      },
      hoverBg: gray800,
      activeBg: "transparent",
    }),
    "ghost-gray-icon": generateStyle({
      basic: {
        color: "gray.400",
        "> svg": {
          color: "gray.600",
        },
      },
      disabled: {
        color: gray500,
        "> svg": {
          color: gray500,
        },
      },
      hoverBg: gray800,
      activeBg: "transparent",
    }),
    "ghost-error": generateStyle({
      basic: { color: "error.main" },
      disabled: { color: "error.light" },
      hoverBg: "error.background",
      activeBg: "transparent",
    }),
    unstyled: {
      boxShadow: "none",
      bgColor: "inherit",
      border: "0px solid transparent",
      ".chakra-stack": {
        p: "0",
      },
    },
  },
  defaultProps: {
    size: "md",
    variant: "primary",
  },
};
