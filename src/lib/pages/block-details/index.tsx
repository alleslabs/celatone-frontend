import { Breadcrumb, BreadcrumbItem, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { useBlockDetailsQuery } from "lib/services/blockService";
import { getFirstQueryParam } from "lib/utils";

import {
  BlockDetailsTop,
  BlockInfo,
  BlockTransactionTable,
} from "./components";

const BlockDetail = () => {
  const router = useRouter();
  const heightParam = getFirstQueryParam(router.query.height);
  const { data: blockData, isLoading } = useBlockDetailsQuery(
    Number(heightParam)
  );

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_BLOCK_DETAIL);
  }, [router.isReady]);

  if (isLoading) return <Loading />;

  return (
    <PageContainer>
      <Breadcrumb
        w="full"
        spacing="4px"
        separator={<CustomIcon name="chevron-right" boxSize="3" />}
      >
        <BreadcrumbItem
          _hover={{ opacity: 0.8 }}
          transition="all 0.25s ease-in-out"
        >
          <AppLink color="text.dark" href="/blocks">
            Blocks
          </AppLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Text
            variant="body2"
            className="ellipsis"
            textTransform="lowercase"
            fontWeight="600"
            width="250px"
            color="text.dark"
          >
            {blockData?.height}
          </Text>
        </BreadcrumbItem>
      </Breadcrumb>
      {blockData ? (
        <>
          <BlockDetailsTop blockData={blockData} />
          <BlockInfo blockData={blockData} />
          <BlockTransactionTable height={Number(heightParam)} />
        </>
      ) : (
        <EmptyState
          imageVariant="not-found"
          heading="Block does not exist"
          message="Please check your input or make sure you have selected the correct network."
          withBorder
        />
      )}
    </PageContainer>
  );
};

export default BlockDetail;
