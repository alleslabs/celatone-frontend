import { Box, Flex, Heading, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { ViewMore } from "lib/components/table";
import { BlocksTable } from "lib/pages/blocks/components/BlocksTable";
import { TxsTable } from "lib/pages/txs/components/TxsTable";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { useLatestBlockInfo } from "lib/services/blockService";
import { useTxsCount } from "lib/services/txService";
import { dateFromNow, formatUTC } from "lib/utils";

const cardProps = {
  width: "100%",
  padding: "16px",
  borderRadius: "8px",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
  cursor: "pointer",
};

const txInfo = {
  title: "Total Transactions",
  tooltip:
    "Verified transactions track network activity and growth, indicating ecosystem health.",
};

const blockInfo = {
  title: "Latest Block Height",
  tooltip:
    "Latest Block Height tracks transactions and network growth for a healthy blockchain ecosystem.",
};

interface CardInfoProps {
  title: string;
  tooltip: string;
  value: string;
  isLoading: boolean;
  navigate: () => void;
}
const CardInfo = ({
  title,
  tooltip,
  value,
  isLoading,
  navigate,
}: CardInfoProps) => (
  <Flex
    style={cardProps}
    _hover={{ bg: "pebble.700" }}
    transition="all .25s ease-in-out"
    bg="pebble.800"
    onClick={navigate}
  >
    <Box>
      <Flex alignItems="center" gap={1} mb={2}>
        <Text variant="body2" color="text.dark">
          {title}
        </Text>
        <Tooltip hasArrow label={tooltip} placement="top" arrowSize={8}>
          <Flex cursor="pointer">
            <CustomIcon name="info-circle-solid" boxSize="3" />
          </Flex>
        </Tooltip>
      </Flex>
      {isLoading ? (
        <Spinner size="md" />
      ) : (
        <Heading as="h5" variant="h5">
          {value}
        </Heading>
      )}
    </Box>
    <CustomIcon name="chevron-right" boxSize={5} />
  </Flex>
);

const NetworkOverview = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_NETWORK_OVERVIEW);
  }, [router.isReady]);

  const {
    data: latestBlockInfo,
    isLoading: isLoadingLatestBlockInfo,
    error: latestBlockInfoError,
  } = useLatestBlockInfo();
  const { data: txsCount, isLoading: isLoadingTxsCount } = useTxsCount();

  const toTxs = () =>
    navigate({
      pathname: "/txs",
    });

  const toBlocks = () =>
    navigate({
      pathname: "/blocks",
    });

  return (
    <PageContainer>
      <Flex justifyContent="space-between" mb={5}>
        <Heading as="h4" variant="h4">
          Network Overview
        </Heading>
        {isLoadingLatestBlockInfo ? (
          <Flex>
            <Spinner size="md" />
            <Text variant="body2" color="text.dark" ml={2}>
              Loading latest data for you ...
            </Text>
          </Flex>
        ) : (
          <Text
            variant="body2"
            color="text.dark"
            textAlign="right"
            whiteSpace="pre-line"
            lineHeight={3}
          >
            {latestBlockInfoError
              ? "Error updating ..."
              : latestBlockInfo?.timestamp &&
                `Updated ${dateFromNow(latestBlockInfo.timestamp)} \n
            ${formatUTC(latestBlockInfo.timestamp)}`}
          </Text>
        )}
      </Flex>
      <Flex gap={4} mb="64px">
        <CardInfo
          title={txInfo.title}
          tooltip={txInfo.tooltip}
          value={txsCount?.toLocaleString() ?? "N/A"}
          isLoading={isLoadingTxsCount}
          navigate={toTxs}
        />
        <CardInfo
          title={blockInfo.title}
          tooltip={blockInfo.tooltip}
          value={latestBlockInfo?.height?.toString() ?? "N/A"}
          isLoading={isLoadingLatestBlockInfo}
          navigate={toBlocks}
        />
      </Flex>

      <Box>
        <Heading as="h5" variant="h5" mb={5}>
          Recent Transactions
        </Heading>
        <TxsTable isViewMore />
        {txsCount && txsCount > 5 && <ViewMore onClick={toTxs} />}
      </Box>

      <Box mt="84px">
        <Heading as="h5" variant="h5" mb={5}>
          Recent Blocks
        </Heading>
        <BlocksTable isViewMore />
        {latestBlockInfo?.height && latestBlockInfo.height > 5 && (
          <ViewMore onClick={toBlocks} />
        )}
      </Box>
    </PageContainer>
  );
};

export default NetworkOverview;
