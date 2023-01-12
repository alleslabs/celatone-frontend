import type { GridProps } from "@chakra-ui/react";
import { chakra, Grid, GridItem } from "@chakra-ui/react";

const StyledGridItem = chakra(GridItem, {
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

export const MigrationHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => {
  return (
    <Grid templateColumns={templateColumns}>
      <StyledGridItem>Code ID</StyledGridItem>
      <StyledGridItem>Code Description</StyledGridItem>
      <StyledGridItem>Sender</StyledGridItem>
      <StyledGridItem>Block Height</StyledGridItem>
      <StyledGridItem>Timestamp</StyledGridItem>
      <StyledGridItem>Remark</StyledGridItem>
    </Grid>
  );
};
