import { chakra, Flex, GridItem } from "@chakra-ui/react";

export const TableContainer = chakra(Flex, {
  baseStyle: {
    overflowY: "hidden",
    overflowX: "scroll",
    flexDir: "column",
    w: "full",
    pb: 0,
  },
});

const stickyBaseStyle = {
  position: "sticky",
  background: "background.main",
};

const tableHeaderBaseStyle = {
  color: "text.main",
  fontSize: "12px",
  fontWeight: 700,
  py: 6,
  px: 4,
  borderBottom: "1px solid",
  borderColor: "gray.700",
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
  color: "text.main",
  fontSize: "14px",
  fontWeight: 400,
  p: 4,
  minH: "75px",
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid",
  borderColor: "gray.700",
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
