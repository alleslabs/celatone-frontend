import type { ComponentStyleConfig } from "@chakra-ui/react";

type Dict = Record<string, string>;

const primaryMain = "primary.main";
const white12 = "rgba(255, 255, 255, 0.12)";
const white50 = "rgba(255, 255, 255, 0.50)";
const borderWhite12 = "1px solid rgba(255, 255, 255, 0.12)";

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
      basic: { background: primaryMain, color: "rgba(0, 0, 0, 0.87)" },
      disabled: {
        background: white12,
        color: white50,
      },
      hoverBg: "primary.dark",
      activeBg: "primary.light",
    }),
    "outline-primary": generateStyle({
      basic: {
        border: "1px solid",
        borderColor: primaryMain,
        color: primaryMain,
      },
      disabled: {
        border: borderWhite12,
        color: white50,
      },
      hoverBg: "rgba(244, 143, 177, 0.08)",
      activeBg: "transparent",
    }),
    "outline-gray": generateStyle({
      basic: {
        border: "1px solid rgba(255, 255, 255, 0.7)",
        color: "rgba(255, 255, 255, 0.7)",
      },
      disabled: {
        border: borderWhite12,
        color: white50,
      },
      hoverBg: white12,
      activeBg: "transparent",
    }),
    "outline-info": generateStyle({
      basic: {
        border: "1px solid rgba(2, 136, 209, 0.5)",
        color: "info.main",
      },
      disabled: {
        border: borderWhite12,
        color: white50,
      },
      hoverBg: "rgba(41, 182, 246, 0.12)",
      activeBg: "transparent",
    }),
    "ghost-primary": generateStyle({
      basic: {
        color: primaryMain,
      },
      disabled: {
        color: white50,
      },
      hoverBg: "rgba(87, 56, 66, 0.3)",
      activeBg: "transparent",
    }),
    "ghost-gray": generateStyle({
      basic: {
        color: "rgba(255, 255, 255, 0.7)",
      },
      disabled: {
        color: white50,
      },
      hoverBg: white12,
      activeBg: "transparent",
    }),
    unstyled: {
      boxShadow: "none",
      bgColor: "inherit",
      border: "0px solid #aa647b",
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
