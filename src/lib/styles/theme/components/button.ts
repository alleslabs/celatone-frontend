import type { ComponentStyleConfig } from "@chakra-ui/react";

type Dict = Record<string, string>;

const pebble400 = "pebble.400";
const pebble600 = "pebble.600";
const pebble700 = "pebble.700";

const violetLight = "violet.light";
const violetMain = "violet.main";
const violetDark = "violet.dark";

const honeydewMain = "honeydew.main";
const honeydewDarker = "honeydew.darker";
const honeydewBg = "honeydew.background";

const lilacMain = "lilac.main";
const lilacBg = "lilac.background";

const textMain = "text.main";
const white12 = "rgba(255, 255, 255, 0.12)";
const borderDefualt = "1px solid";

const generateStyle = ({
  basic,
  disabled,
  hoverBg,
  activeBg,
}: {
  basic: Dict;
  disabled: Dict;
  hoverBg: string;
  activeBg: string;
}) => {
  return {
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
  };
};

export const Button: ComponentStyleConfig = {
  baseStyle: {
    display: "flex",
    flexDir: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
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
      basic: { background: violetMain, color: textMain },
      disabled: {
        background: "rgba(41, 38, 118, 0.7)",
        color: pebble600,
      },
      hoverBg: violetDark,
      activeBg: violetLight,
    }),
    error: generateStyle({
      basic: { background: "error.main", color: "black" },
      disabled: {
        background: "error.dark",
        color: "black",
      },
      hoverBg: "error.dark",
      activeBg: "error.light",
    }),
    "outline-primary": generateStyle({
      basic: {
        border: borderDefualt,
        borderColor: violetLight,
        color: violetLight,
      },
      disabled: {
        border: borderDefualt,
        borderColor: pebble700,
        color: pebble600,
      },
      hoverBg: lilacBg,
      activeBg: "transparent",
    }),
    "outline-gray": generateStyle({
      basic: {
        border: borderDefualt,
        borderColor: pebble400,
        color: pebble400,
      },
      disabled: {
        border: borderDefualt,
        borderColor: pebble700,
        color: pebble600,
      },
      hoverBg: white12,
      activeBg: "transparent",
    }),
    "outline-info": generateStyle({
      basic: {
        border: borderDefualt,
        borderColor: honeydewBg,
        color: honeydewMain,
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
        color: lilacMain,
      },
      disabled: {
        color: lilacBg,
      },
      hoverBg: lilacBg,
      activeBg: "transparent",
    }),
    "ghost-info": generateStyle({
      basic: {
        color: honeydewMain,
      },
      disabled: {
        color: honeydewBg,
      },
      hoverBg: honeydewBg,
      activeBg: "transparent",
    }),
    "ghost-gray": generateStyle({
      basic: {
        color: pebble400,
      },
      disabled: {
        color: "pebble.500",
      },
      hoverBg: pebble700,
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
