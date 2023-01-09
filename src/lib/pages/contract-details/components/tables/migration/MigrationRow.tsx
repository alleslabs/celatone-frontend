import { chakra, Flex, Grid, GridItem } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";

const StyledGridItem = chakra(GridItem, {
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

export const MigrationRow = () => {
  return (
    <Grid templateColumns="90px minmax(300px, 1fr) repeat(2, max(150px)) max(232px) max(180px)">
      <StyledGridItem>
        {/* code id */}
        <ExplorerLink value="55" canCopyWithHover />
      </StyledGridItem>
      <StyledGridItem>Deposit asset to Lorem</StyledGridItem>
      <StyledGridItem>
        {/* migrated by */}
        <ExplorerLink
          type="user_address"
          value="osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p"
          textFormat="truncate"
          canCopyWithHover
        />
      </StyledGridItem>
      <StyledGridItem>
        {/* block */}
        <ExplorerLink value="12345678" canCopyWithHover />
      </StyledGridItem>
      <StyledGridItem>
        <Flex
          direction="column"
          fontSize="12px"
          sx={{ "& p + p": { color: "text.dark", mt: "2px" } }}
        >
          <p>Oct 24, 2022, 7:58:34 PM (GMT+7)</p>
          <p>(6 days ago)</p>
        </Flex>
      </StyledGridItem>
      <StyledGridItem>
        <Flex
          direction="column"
          sx={{
            "& p:first-of-type": {
              color: "text.dark",
              fontSize: "12px",
              mb: "2px",
            },
          }}
        >
          <p>Through Proposal ID</p>
          <ExplorerLink value="7F8FD8...3A8204D0E" canCopyWithHover />
        </Flex>
      </StyledGridItem>
    </Grid>
  );
};
