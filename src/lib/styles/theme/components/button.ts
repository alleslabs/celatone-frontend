import type { ComponentStyleConfig } from "@chakra-ui/react";

type Dict = Record<string, string>;

const pebble600 = "pebble.600";
const pebble700 = "pebble.700";
const violetLight = "violet.light";
const honeydewBg = "honeydew.background";
const honeydewDarker = "honeydew.darker";
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
      basic: { background: "violet.main", color: "text.main" },
      disabled: {
        background: "violet.background",
        color: pebble600,
      },
      hoverBg: "violet.dark",
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
      hoverBg: "violet.background",
      activeBg: "transparent",
    }),
    "outline-gray": generateStyle({
      basic: {
        border: borderDefualt,
        borderColor: pebble600,
        color: "pebble.400",
      },
      disabled: {
        border: borderDefualt,
        borderColor: pebble700,
        color: pebble600,
      },
      hoverBg: pebble700,
      activeBg: "transparent",
    }),
    "outline-info": generateStyle({
      basic: {
        border: borderDefualt,
        borderColor: honeydewBg,
        color: "honeydew.main",
      },
      disabled: {
        border: honeydewDarker,
        color: honeydewDarker,
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
        color: "lilac.main",
      },
      disabled: {
        color: "lilac.background",
      },
      hoverBg: "lilac.background",
      activeBg: "transparent",
    }),
    "ghost-info": generateStyle({
      basic: {
        color: "honeydew.main",
      },
      disabled: {
        color: honeydewBg,
      },
      hoverBg: honeydewBg,
      activeBg: "transparent",
    }),
    "ghost-gray": generateStyle({
      basic: {
        color: "pebble.400",
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
