import { chakra, Flex, GridItem, SimpleGrid } from "@chakra-ui/react";

export const TableContainer = chakra(Flex, {
  baseStyle: {
    flexDir: "column",
    overflowX: "scroll",
    overflowY: "hidden",
    pb: 0,
    w: "full",
  },
});

const stickyBaseStyle = {
  background: "background.main",
  position: "sticky",
};

const tableHeaderBaseStyle = {
  borderBottom: "1px solid",
  borderColor: "gray.700",
  color: "text.main",
  fontSize: "12px",
  fontWeight: 700,
  px: 4,
  py: 6,
};

export const TableHeader = chakra(GridItem, {
  baseStyle: tableHeaderBaseStyle,
});

export const TableHeaderFreeze = chakra(GridItem, {
  baseStyle: {
    ...tableHeaderBaseStyle,
    ...stickyBaseStyle,
  },
});

const tableRowBaseStyle = {
  alignItems: "center",
  borderBottom: "1px solid",
  borderColor: "gray.700",
  color: "text.main",
  display: "flex",
  fontSize: "14px",
  fontWeight: 400,
  minH: "75px",
  minW: 0,
  p: 4,
};

export const TableRow = chakra(GridItem, {
  baseStyle: tableRowBaseStyle,
});

export const TableNoBorderRow = chakra(GridItem, {
  baseStyle: {
    ...tableRowBaseStyle,
    borderBottom: undefined,
    borderColor: undefined,
  },
});

export const TableRowFreeze = chakra(GridItem, {
  baseStyle: {
    ...tableRowBaseStyle,
    ...stickyBaseStyle,
  },
});

// Mobile
export const MobileTableContainer = chakra(SimpleGrid, {
  baseStyle: {
    columns: 1,
    gap: 4,
    my: 4,
    w: "full",
  },
});
