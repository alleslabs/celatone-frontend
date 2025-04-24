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
  activeBg,
  basic,
  disabled,
  hoverBg,
}: {
  activeBg: string;
  basic: object;
  disabled: object;
  hoverBg: string;
}) => {
  return defineStyle({
    ...basic,
    _active: {
      background: activeBg,
    },
    _disabled: { opacity: 1, ...disabled },
    _hover: {
      _disabled: { ...disabled },
      _loading: { ...basic },
      background: hoverBg,
    },
    _loading: { ...basic },
  });
};

export const Button: ComponentStyleConfig = {
  baseStyle: {
    _active: {
      transform: "scale(0.98)",
    },
    alignItems: "center",
    borderRadius: "8px",
    boxShadow: "none",
    display: "flex",
    flexDir: "row",
    fontFamily: "heading",
    fontWeight: 600,
    justifyContent: "center",
  },
  defaultProps: {
    size: "md",
    variant: "primary",
  },
  sizes: {
    md: {
      fontSize: "14px",
      fontWeight: 600,
      height: "36px",
      padding: "6px 16px",
    },
    sm: {
      fontSize: "12px",
      fontWeight: 600,
      height: "30px",
      padding: "4px 10px",
    },
  },
  variants: {
    "command-button": generateStyle({
      activeBg: "transparent",
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
    }),
    error: generateStyle({
      activeBg: "error.light",
      basic: { background: "error.main", color: "black" },
      disabled: {
        background: errorDark,
        color: "black",
      },
      hoverBg: errorDark,
    }),
    "ghost-error": generateStyle({
      activeBg: "transparent",
      basic: { color: "error.main" },
      disabled: { color: "error.light" },
      hoverBg: "error.background",
    }),
    "ghost-gray": generateStyle({
      activeBg: "transparent",
      basic: {
        "> svg": {
          color: "gray.400",
        },
        color: "gray.400",
      },
      disabled: {
        "> svg": {
          color: gray500,
        },
        color: gray500,
      },
      hoverBg: gray800,
    }),
    "ghost-gray-icon": generateStyle({
      activeBg: "transparent",
      basic: {
        "> svg": {
          color: "gray.600",
        },
        color: "gray.400",
      },
      disabled: {
        "> svg": {
          color: gray500,
        },
        color: gray500,
      },
      hoverBg: gray800,
    }),
    "ghost-primary": generateStyle({
      activeBg: "transparent",
      basic: {
        "> svg": {
          color: "primaryLight",
        },
        color: primaryLight,
      },
      disabled: {
        "> svg": {
          color: primaryDark,
        },
        color: primaryDark,
      },
      hoverBg: primaryBg,
    }),
    "ghost-white": generateStyle({
      activeBg: "transparent",
      basic: {
        "> svg": {
          color: "gray.300",
        },
        color: "gray.300",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: 0,
      },
      disabled: {
        "> svg": {
          color: gray500,
        },
        color: gray500,
      },
      hoverBg: gray800,
    }),
    "gray-solid": generateStyle({
      activeBg: gray700,
      basic: {
        background: gray800,
        color: "text.main",
      },
      disabled: {
        background: gray800,
        color: gray500,
      },
      hoverBg: gray700,
    }),
    "outline-gray": generateStyle({
      activeBg: "transparent",
      basic: {
        "> svg": {
          color: "text.dark",
        },
        border: borderDefault,
        borderColor: gray600,
        color: "text.dark",
      },
      disabled: {
        "> svg": {
          color: gray600,
        },
        border: borderDefault,
        borderColor: gray700,
        color: gray600,
      },
      hoverBg: gray700,
    }),
    "outline-primary": generateStyle({
      activeBg: "button.outlinePrimary.activeBackground",
      basic: {
        "& span": {
          color: buttonOutlinePrimaryColor,
        },
        "> div": {
          color: buttonOutlinePrimaryColor,
        },
        "> svg": {
          color: buttonOutlinePrimaryColor,
        },
        border: borderDefault,
        borderColor: "button.outlinePrimary.borderColor",
        color: buttonOutlinePrimaryColor,
      },
      disabled: {
        "& span": {
          color: "button.outlinePrimary.disabledColor",
        },
        border: borderDefault,
        borderColor: "button.outlinePrimary.disabledBorderColor",
        color: "button.outlinePrimary.disabledColor",
      },
      hoverBg: "button.outlinePrimary.hoverBackground",
    }),
    "outline-secondary": generateStyle({
      activeBg: "transparent",
      basic: {
        "> svg": {
          color: secondaryMain,
        },
        border: borderDefault,
        borderColor: secondaryBg,
        color: secondaryMain,
      },
      disabled: {
        "> svg": {
          color: secondaryDarker,
        },
        border: secondaryDarker,
        color: secondaryDarker,
      },
      hoverBg: secondaryBg,
    }),
    "outline-white": generateStyle({
      activeBg: "transparent",
      basic: {
        "> svg": {
          color: "text.main",
        },
        background: "background.main",
        border: borderDefault,
        borderColor: gray400,
        color: "text.main",
      },
      disabled: {
        "> svg": {
          color: gray600,
        },
        border: borderDefault,
        borderColor: gray600,
        color: gray600,
      },
      hoverBg: gray700,
    }),
    primary: generateStyle({
      activeBg: "button.primary.activeBackground",
      basic: {
        "& span": {
          color: "button.primary.color",
        },
        background: "button.primary.background",
        color: "button.primary.color",
      },
      disabled: {
        "& span": {
          color: "button.primary.disabledColor",
        },
        background: "button.primary.disabledBackground",
        color: "button.primary.disabledColor",
      },
      hoverBg: "button.primary.hoverBackground",
    }),
    unstyled: {
      ".chakra-stack": {
        p: "0",
      },
      bgColor: "inherit",
      border: "0px solid transparent",
      boxShadow: "none",
    },
    "white-solid": generateStyle({
      activeBg: "gray.100",
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
    }),
  },
};
