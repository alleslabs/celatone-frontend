import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import {
  useCelatoneApp,
  useInternalNavigate,
  useMobile,
} from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { UserDocsLink } from "lib/components/UserDocsLink";
import type { Option } from "lib/types";

import { CardInfo } from "./CardInfo";
import { DevShortcut } from "./DevShortcut";

const txInfo = {
  title: "Total Transactions",
  tooltip:
    "Verified transactions track network activity and growth, indicating ecosystem health.",
};

const blockInfo = {
  title: "Latest Block Height",
  tooltip: "The latest block height indexed by the indexer.",
};

const blockTimeInfo = {
  title: "Block Time",
  tooltip: "Median time to finality of the last 100 indexed blocks.",
};

interface HomeTopProps {
  tx: Option<string>;
  isTxLoading: boolean;
  block: Option<string>;
  isBlockLoading: boolean;
  blockTime: Option<string>;
  isBlockTimeLoading: boolean;
}

export const HomeTop = ({
  tx,
  isTxLoading,
  block,
  isBlockLoading,
  blockTime,
  isBlockTimeLoading,
}: HomeTopProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const {
    chainConfig: { prettyName },
    theme,
  } = useCelatoneApp();

  const toTxs = () =>
    navigate({
      pathname: "/txs",
    });

  const toBlocks = () =>
    navigate({
      pathname: "/blocks",
    });

  return (
    <>
      <Flex
        direction="column"
        mb={12}
        position="relative"
        overflow="hidden"
        sx={{ "& > div": { zIndex: 1 } }}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb={5}
          zIndex={1}
        >
          <Heading as="h4" variant={{ base: "h5", md: "h4" }}>
            <Text as="span" color="accent.main">
              {prettyName}
            </Text>{" "}
            Overview
          </Heading>
          <UserDocsLink isButton href="introduction/overview" />
        </Flex>
        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <CardInfo
            title={txInfo.title}
            tooltip={txInfo.tooltip}
            value={tx}
            isLoading={isTxLoading}
            navigate={toTxs}
          />
          <CardInfo
            title={blockInfo.title}
            tooltip={blockInfo.tooltip}
            value={block}
            isLoading={isBlockLoading}
            navigate={toBlocks}
          />
          <CardInfo
            title={blockTimeInfo.title}
            tooltip={blockTimeInfo.tooltip}
            value={blockTime}
            isLoading={isBlockTimeLoading}
            navigate={toTxs}
          />
        </Flex>
      </Flex>
      {!isMobile && (
        <Box as="section" mb="48px">
          <Flex gap={4} direction="column">
            <Heading as="h5" variant="h5">
              Dev Shortcuts
            </Heading>
            <ConnectWalletAlert
              title={`Connect wallet to start using ${theme.branding.seo.appName}`}
              subtitle="Specific use cases such as deploying new contract or sending execute messages require a wallet connection."
            />
            <DevShortcut />
          </Flex>
        </Box>
      )}
    </>
  );
};
