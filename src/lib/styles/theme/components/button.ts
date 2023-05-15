import type { ComponentStyleConfig } from "@chakra-ui/react";
import { defineStyle } from "@chakra-ui/react";

const pebble500 = "pebble.500";
const pebble600 = "pebble.600";
const pebble700 = "pebble.700";
const pebble800 = "pebble.800";
const pebble900 = "pebble.900";
const violetLight = "violet.light";
const violetDark = "violet.dark";
const violetBg = "violet.background";
const honeydewBg = "honeydew.background";
const honeydewMain = "honeydew.main";
const honeydewDarker = "honeydew.darker";
const borderDefualt = "1px solid";
const errorDark = "error.dark";
const lilacBg = "lilac.background";

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
  },
  sizes: {
    sm: {
      fontSize: "12px",
      padding: "4px 10px",
      height: "30px",
      fontWeight: 700,
      letterSpacing: "0.4px",
    },
    md: {
      fontSize: "14px",
      padding: "6px 16px",
      height: "36px",
      fontWeight: 700,
      letterSpacing: "0.4px",
    },
  },
  variants: {
    primary: generateStyle({
      basic: {
        background: "violet.main",
        color: pebble900,
        "& span": {
          color: pebble900,
        },
      },
      disabled: {
        background: violetBg,
        color: pebble900,
        "& span": {
          color: pebble900,
        },
      },
      hoverBg: violetDark,
      activeBg: violetLight,
    }),
    "gray-solid": generateStyle({
      basic: {
        background: pebble800,
        color: "text.main",
      },
      disabled: {
        background: pebble800,
        color: pebble500,
      },
      hoverBg: pebble700,
      activeBg: pebble700,
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
        border: borderDefualt,
        borderColor: "violet.dark",
        color: violetLight,
        "> div": {
          color: violetLight,
        },
        "> svg": {
          color: violetLight,
        },
      },
      disabled: {
        border: borderDefualt,
        borderColor: pebble700,
        color: pebble600,
        "> svg": {
          color: pebble600,
        },
      },
      hoverBg: violetBg,
      activeBg: "transparent",
    }),
    "outline-gray": generateStyle({
      basic: {
        border: borderDefualt,
        borderColor: pebble500,
        color: "text.dark",
        "> svg": {
          color: "text.dark",
        },
      },
      disabled: {
        border: borderDefualt,
        borderColor: pebble700,
        color: pebble600,
        "> svg": {
          color: pebble600,
        },
      },
      hoverBg: pebble700,
      activeBg: "transparent",
    }),
    "outline-info": generateStyle({
      basic: {
        border: borderDefualt,
        borderColor: honeydewBg,
        color: honeydewMain,
        "> svg": {
          color: honeydewMain,
        },
      },
      disabled: {
        border: honeydewDarker,
        color: honeydewDarker,
        "> svg": {
          color: honeydewDarker,
        },
      },
      hoverBg: honeydewBg,
      activeBg: "transparent",
    }),
    "command-button": generateStyle({
      basic: {
        border: borderDefualt,
        borderColor: honeydewDarker,
        color: "text.main",
      },
      disabled: {
        border: honeydewDarker,
        color: honeydewDarker,
      },
      hoverBg: honeydewBg,
      activeBg: "transparent",
    }),
    "ghost-primary": generateStyle({
      basic: {
        color: violetLight,
        "> svg": {
          color: "violetLight",
        },
      },
      disabled: {
        color: violetDark,
        "> svg": {
          color: violetDark,
        },
      },
      hoverBg: violetBg,
      activeBg: "transparent",
    }),
    "ghost-lilac": generateStyle({
      basic: {
        color: "lilac.main",
        "> svg": {
          color: "lilac.main",
        },
      },
      disabled: {
        color: lilacBg,
        "> svg": {
          color: lilacBg,
        },
      },
      hoverBg: lilacBg,
      activeBg: "transparent",
    }),
    "ghost-info": generateStyle({
      basic: {
        color: honeydewMain,
        "> svg": {
          color: honeydewMain,
        },
      },
      disabled: {
        color: honeydewBg,
        "> svg": {
          color: honeydewBg,
        },
      },
      hoverBg: honeydewBg,
      activeBg: "transparent",
    }),
    "ghost-gray": generateStyle({
      basic: {
        color: "pebble.400",
        "> svg": {
          color: "pebble.400",
        },
      },
      disabled: {
        color: pebble500,
        "> svg": {
          color: pebble500,
        },
      },
      hoverBg: pebble800,
      activeBg: "transparent",
    }),
    "ghost-error": generateStyle({
      basic: { color: "error.main" },
      disabled: { color: "error.light" },
      hoverBg: errorDark,
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
