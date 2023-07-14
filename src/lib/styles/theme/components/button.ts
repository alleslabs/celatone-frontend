import type { ComponentStyleConfig } from "@chakra-ui/react";
import { defineStyle } from "@chakra-ui/react";

import { CURR_THEME } from "env";

const gray500 = "gray.500";
const gray600 = "gray.600";
const gray700 = "gray.700";
const gray800 = "gray.800";
const primaryLight = "primary.light";
const primaryDark = "primary.dark";
const primaryBg = "primary.background";
const accentBg = "accent.background";
const accentMain = "accent.main";
const accentDarker = "accent.darker";
const borderDefualt = "1px solid";
const errorDark = "error.dark";
const secondaryBg = "secondary.background";

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
    primary: CURR_THEME.button?.primary
      ? generateStyle({
          basic: {
            background: CURR_THEME.button.primary.background,
            color: CURR_THEME.button.primary.color,
            "& span": {
              color: CURR_THEME.button.primary.color,
            },
          },
          disabled: {
            background: CURR_THEME.button.primary.disabledBackground,
            color: CURR_THEME.button.primary.disabledColor,
            "& span": {
              color: CURR_THEME.button.primary.disabledColor,
            },
          },
          hoverBg: primaryDark,
          activeBg: primaryLight,
        })
      : generateStyle({
          basic: {
            background: "primary.main",
            color: "text.main",
            "& span": {
              color: "text.main",
            },
          },
          disabled: {
            background: primaryBg,
            color: gray600,
            "& span": {
              color: gray600,
            },
          },
          hoverBg: primaryDark,
          activeBg: primaryLight,
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
    error: generateStyle({
      basic: { background: "error.main", color: "black" },
      disabled: {
        background: errorDark,
        color: "black",
      },
      hoverBg: errorDark,
      activeBg: "error.light",
    }),
    "outline-primary": CURR_THEME.button?.outlinePrimary
      ? generateStyle({
          basic: {
            border: borderDefualt,
            borderColor: CURR_THEME.button.outlinePrimary.borderColor,
            color: CURR_THEME.button.outlinePrimary.color,
            "> div": {
              color: CURR_THEME.button.outlinePrimary.color,
            },
            "> svg": {
              color: CURR_THEME.button.outlinePrimary.color,
            },
          },
          disabled: {
            border: borderDefualt,
            borderColor: CURR_THEME.button.outlinePrimary.disabledBorderColor,
            color: CURR_THEME.button.outlinePrimary.disabledColor,
            "& span": {
              color: CURR_THEME.button.outlinePrimary.disabledColor,
            },
          },
          hoverBg: primaryDark,
          activeBg: primaryLight,
        })
      : generateStyle({
          basic: {
            border: borderDefualt,
            borderColor: primaryLight,
            color: primaryLight,
            "> div": {
              color: primaryLight,
            },
            "> svg": {
              color: primaryLight,
            },
          },
          disabled: {
            border: borderDefualt,
            borderColor: gray700,
            color: gray600,
            "> svg": {
              color: gray600,
            },
          },
          hoverBg: primaryBg,
          activeBg: "transparent",
        }),
    "outline-gray": generateStyle({
      basic: {
        border: borderDefualt,
        borderColor: gray600,
        color: "text.dark",
        "> svg": {
          color: "text.dark",
        },
      },
      disabled: {
        border: borderDefualt,
        borderColor: gray700,
        color: gray600,
        "> svg": {
          color: gray600,
        },
      },
      hoverBg: gray700,
      activeBg: "transparent",
    }),
    "outline-accent": generateStyle({
      basic: {
        border: borderDefualt,
        borderColor: accentBg,
        color: accentMain,
        "> svg": {
          color: accentMain,
        },
      },
      disabled: {
        border: accentDarker,
        color: accentDarker,
        "> svg": {
          color: accentDarker,
        },
      },
      hoverBg: accentBg,
      activeBg: "transparent",
    }),
    "command-button": generateStyle({
      basic: {
        border: borderDefualt,
        borderColor: accentDarker,
        color: "text.main",
      },
      disabled: {
        border: accentDarker,
        color: accentDarker,
      },
      hoverBg: accentBg,
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
    "ghost-secondary": generateStyle({
      basic: {
        color: "secondary.main",
        "> svg": {
          color: "secondary.main",
        },
      },
      disabled: {
        color: secondaryBg,
        "> svg": {
          color: secondaryBg,
        },
      },
      hoverBg: secondaryBg,
      activeBg: "transparent",
    }),
    "ghost-accent": generateStyle({
      basic: {
        color: accentMain,
        "> svg": {
          color: accentMain,
        },
      },
      disabled: {
        color: accentBg,
        "> svg": {
          color: accentBg,
        },
      },
      hoverBg: accentBg,
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
