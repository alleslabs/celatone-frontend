import { chakra, GridItem } from "@chakra-ui/react";

export const StyledTableHeader = chakra(GridItem, {
  baseStyle: {
    color: "text.main",
    fontSize: "12px",
    fontWeight: 700,
    py: 6,
    px: 4,
    borderY: "1px solid",
    borderColor: "divider.main",
  },
});

export const StyledTableRow = chakra(GridItem, {
  baseStyle: {
    color: "text.main",
    fontSize: "14px",
    fontWeight: 400,
    p: 4,
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid",
    borderColor: "divider.main",
  },
});
