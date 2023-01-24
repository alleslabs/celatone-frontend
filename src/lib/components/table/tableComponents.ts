import { chakra, Flex, GridItem } from "@chakra-ui/react";

export const TableContainer = chakra(Flex, {
  baseStyle: {
    overflowX: "scroll",
    flexDir: "column",
    w: "full",
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
    borderColor: "divider.main",
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
    borderColor: "divider.main",
  },
});
