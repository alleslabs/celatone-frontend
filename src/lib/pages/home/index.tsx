import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { CURR_THEME } from "env";
import { useCelatoneApp, useInternalNavigate } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { ViewMore } from "lib/components/table";
import { Tooltip } from "lib/components/Tooltip";
import { BlocksTable } from "lib/pages/blocks/components/BlocksTable";
import { TxsTable } from "lib/pages/txs/components/TxsTable";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import {
  useAverageBlockTime,
  useLatestBlockInfo,
} from "lib/services/blockService";
import { useTxsCount } from "lib/services/txService";
import type { Option } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { DevShortcut, TopDecorations } from "./components";

const cardProps: SystemStyleObject = {
  width: "100%",
  padding: "16px",
  borderRadius: "8px",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
  cursor: "pointer",
  boxShadow: "0px 4px 1px 0px var(--chakra-colors-gray-700)",
};

const txInfo = {
  title: "Total Transactions",
  tooltip:
    "Verified transactions track network activity and growth, indicating ecosystem health.",
};

const blockTimeInfo = {
  title: "Average Block Time",
  tooltip: "Average time to finality between the last 100 indexed blocks.",
};

const blockInfo = {
  title: "Latest Block Height",
  tooltip:
    "Latest Block Height tracks transactions and network growth for a healthy blockchain ecosystem.",
};

const indexedBlockInfo = {
  title: "Latest Indexed Block Height",
  tooltip: "The latest block height indexed by the indexer.",
};

const getBlockInfo = (chain: string) =>
  chain === "sei" ? indexedBlockInfo : blockInfo;

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
    sx={cardProps}
    _hover={{ bg: "gray.700" }}
    transition="all .25s ease-in-out"
    bg="gray.800"
    onClick={navigate}
    cursor="pointer"
  >
    <Box>
      <Flex alignItems="center" gap={1} mb={2}>
        <Text variant="body2" color="text.dark">
          {title}
        </Text>
        <Tooltip label={tooltip}>
          <Flex cursor="pointer">
            <CustomIcon name="info-circle-solid" boxSize={3} color="gray.600" />
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
    <CustomIcon name="chevron-right" boxSize={5} color="gray.600" />
  </Flex>
);

const calculateAverageBlockTime = (
  latest: Option<Date>,
  hundred: Option<Date>
) => {
  if (!latest || !hundred) return "N/A";
  return `${((latest.getTime() - hundred.getTime()) / 100 / 1000)
    .toFixed(3)
    .toString()}s`;
};

const Home = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { isDevMode } = useCelatoneApp();

  const {
    chainConfig: { chain, prettyName },
  } = useCelatoneApp();
  const {
    data: latestBlockInfo,
    isLoading: isLoadingLatestBlockInfo,
    error: latestBlockInfoError,
  } = useLatestBlockInfo();
  const { data } = useAverageBlockTime();
  const averageBlockTime = calculateAverageBlockTime(
    data?.latest,
    data?.hundred
  );
  const { data: txsCount, isLoading: isLoadingTxsCount } = useTxsCount();

  const chainBlockInfo = getBlockInfo(chain);

  const toTxs = () =>
    navigate({
      pathname: "/txs",
    });

  const toBlocks = () =>
    navigate({
      pathname: "/blocks",
    });

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_NETWORK_OVERVIEW);
  }, [router.isReady]);

  return (
    <PageContainer>
      <Flex
        direction="column"
        p={{ base: 3, md: 12 }}
        mb={12}
        borderRadius="12px"
        border="0px 0px 4px 0px"
        borderColor="gray.800"
        boxShadow="0px 6px 1px 0px var(--chakra-colors-gray-800)"
        bgColor="gray.900"
        position="relative"
        overflow="hidden"
        sx={{ "& > div": { zIndex: 1 } }}
      >
        <TopDecorations />
        <Flex
          justifyContent={{ base: "start", md: "space-between" }}
          align={{ base: "start", md: "start" }}
          mb={5}
          direction={{ base: "column", md: "row" }}
          zIndex={1}
        >
          <Heading
            as="h4"
            variant={{ base: "h5", md: "h4" }}
            mb={{ base: 4, md: 0 }}
          >
            <Text as="span" color="accent.main">
              {prettyName}
            </Text>{" "}
            Overview
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
              textAlign={{ base: "left", md: "right" }}
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
        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <CardInfo
            title={txInfo.title}
            tooltip={txInfo.tooltip}
            value={txsCount?.toLocaleString() ?? "N/A"}
            isLoading={isLoadingTxsCount}
            navigate={toTxs}
          />
          <CardInfo
            title={chainBlockInfo.title}
            tooltip={chainBlockInfo.tooltip}
            value={latestBlockInfo?.height?.toString() ?? "N/A"}
            isLoading={isLoadingLatestBlockInfo}
            navigate={toBlocks}
          />
          <CardInfo
            title={blockTimeInfo.title}
            tooltip={blockTimeInfo.tooltip}
            value={averageBlockTime}
            isLoading={isLoadingTxsCount}
            navigate={toTxs}
          />
        </Flex>
      </Flex>

      {isDevMode && (
        <section style={{ marginBottom: "48px" }}>
          <Flex gap={4} direction="column">
            <Heading as="h5" variant="h5">
              Dev Shortcuts
            </Heading>
            <ConnectWalletAlert
              title={`Connect wallet to start using ${CURR_THEME.branding.seo.appName}`}
              subtitle="Specific use cases such as deploying new contract or sending execute messages require a wallet connection."
            />
            <DevShortcut />
          </Flex>
        </section>
      )}

      <section style={{ marginBottom: "48px" }}>
        <Heading as="h5" variant="h5" mb={5}>
          Recent Transactions
        </Heading>
        <TxsTable isViewMore />
        {txsCount && txsCount > 5 && <ViewMore onClick={toTxs} />}
      </section>

      <section>
        <Heading as="h5" variant="h5" mb={5}>
          Recent Blocks
        </Heading>
        <BlocksTable isViewMore />
        {latestBlockInfo?.height && latestBlockInfo.height > 5 && (
          <ViewMore onClick={toBlocks} />
        )}
      </section>
    </PageContainer>
  );
};

export default Home;
