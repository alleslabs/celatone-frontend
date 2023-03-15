import { chakra, Flex, GridItem } from "@chakra-ui/react";

export const TableContainer = chakra(Flex, {
  baseStyle: {
    overflowY: "hidden",
    overflowX: "scroll",
    flexDir: "column",
    w: "full",
    pb: 6,
  },
});

export const TableHeader = chakra(GridItem, {
  baseStyle: {
    color: "text.main",
    fontSize: "12px",
    fontWeight: 700,
    py: 6,
    px: 4,
    borderBottom: "1px solid",
    borderColor: "pebble.700",
  },
});

export const TableHeaderNoBorder = chakra(GridItem, {
  baseStyle: {
    color: "text.main",
    fontSize: "12px",
    fontWeight: 700,
    py: 6,
    px: 4,
  },
});

export const TableRow = chakra(GridItem, {
  baseStyle: {
    color: "text.main",
    fontSize: "14px",
    fontWeight: 400,
    p: 4,
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid",
    borderColor: "pebble.700",
  },
});

export const TableRowNoBorder = chakra(GridItem, {
  baseStyle: {
    color: "text.main",
    fontSize: "14px",
    fontWeight: 400,
    p: 4,
    display: "flex",
    alignItems: "center",
  },
});
