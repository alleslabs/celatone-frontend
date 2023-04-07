import { Box } from "@chakra-ui/react";

import { BackButton } from "lib/components/button";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state";
import { TableTitle } from "lib/components/table";

import { BlockDetailTop } from "./components/BlockDetailTop";
import { BlockInfo } from "./components/BlockInfo";

const BlockDetail = () => (
  <PageContainer>
    <BackButton />
    <BlockDetailTop />
    <BlockInfo />
    <Box>
      <TableTitle title="Transaction" count={0} />
      <EmptyState
        imageVariant="empty"
        message="There are no submitted transactions  in this block."
        withBorder
      />
    </Box>
  </PageContainer>
);

export default BlockDetail;
