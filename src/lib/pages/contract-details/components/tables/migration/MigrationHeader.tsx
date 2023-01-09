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

export const MigrationHeader = () => {
  return (
    <Grid templateColumns="90px minmax(300px, 1fr) repeat(2, max(150px)) max(232px) max(180px)">
      <StyledGridItem>Code ID</StyledGridItem>
      <StyledGridItem>Code Description</StyledGridItem>
      <StyledGridItem>Sender</StyledGridItem>
      <StyledGridItem>Block Height</StyledGridItem>
      <StyledGridItem>Timestamp</StyledGridItem>
      <StyledGridItem>Remark</StyledGridItem>
    </Grid>
  );
};
