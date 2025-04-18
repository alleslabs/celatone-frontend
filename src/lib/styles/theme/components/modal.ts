import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  body: {
    color: "text.main",
    py: "16px",
  },
  closeButton: {
    top: "14px",
  },
  dialog: {
    bg: "gray.900",
    borderRadius: "8px",
  },
  header: {
    alignItems: "center",
    color: "text.main",
    display: "flex",
    fontSize: "24px",
    fontWeight: 700,
    gap: "12px",
  },
  overlay: {
    bg: "background.overlay",
  },
});

export const Modal = defineMultiStyleConfig({
  baseStyle,
  defaultProps: { size: "2xl" },
});
