import type { FlexProps } from "@chakra-ui/react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import { trackUseViewJSON } from "lib/amplitude";
import { useEvmConfig, useMobile } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { useOpenTxTab } from "lib/hooks";
import type { TxData } from "lib/services/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface TxHeaderProps extends FlexProps {
  txData: TxData;
}

const DotSeparator = () => (
  <Box bg="primary.darker" h={1} w={1} borderRadius="50%" />
);

export const TxHeader = ({ txData, ...flexProps }: TxHeaderProps) => {
  const isMobile = useMobile();
  const evm = useEvmConfig({ shouldRedirect: false });
  const openLcdTab = useOpenTxTab("lcd");

  return (
    <Flex gap={2} direction="column" {...flexProps}>
      <Flex align="center" justify="space-between">
        <Flex gap={2} mb={{ base: 2, md: 0 }} mt={{ base: 2, md: 4 }}>
          <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
            {evm.enabled ? "Cosmos " : ""}Transaction Details
          </Heading>
          {isMobile && (
            <Flex
              align="center"
              gap={1}
              color={txData.isTxFailed ? "error.main" : "success.main"}
            >
              {txData.isTxFailed ? (
                <>
                  <CustomIcon
                    m={0}
                    name="close-circle-solid"
                    boxSize={3}
                    color="error.main"
                  />
                  <Text variant="body2" color="error.main">
                    Failed
                  </Text>
                </>
              ) : (
                <>
                  <CustomIcon
                    m={0}
                    name="check-circle-solid"
                    boxSize={3}
                    color="success.main"
                  />
                  <Text variant="body2" color="success.main">
                    Success
                  </Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
        {!isMobile && (
          <Button
            variant="ghost-gray"
            onClick={() => {
              trackUseViewJSON("tx_page_transaction_hash");
              openLcdTab(txData.txhash);
            }}
            rightIcon={<CustomIcon m={0} name="launch" boxSize={3} />}
          >
            View in JSON
          </Button>
        )}
      </Flex>
      <Flex
        gap={{ base: 1, md: 2 }}
        w="full"
        direction={{ base: "column", md: "row" }}
        fontSize="14px"
      >
        <Text variant="body2" color="text.dark" fontWeight={500}>
          Transaction Hash:
        </Text>
        <CopyLink
          type="tx_hash"
          value={txData.txhash}
          amptrackSection="tx_header"
        />
      </Flex>
      <Flex align="center" gap={2} color="text.dark" fontSize="14px">
        {!isMobile && (
          <>
            <Flex
              align="center"
              gap={1}
              color={txData.isTxFailed ? "error.main" : "success.main"}
            >
              {txData.isTxFailed ? (
                <>
                  <CustomIcon
                    m={0}
                    name="close-circle-solid"
                    boxSize={3}
                    color="error.main"
                  />
                  <Text variant="body2" color="error.main">
                    Failed
                  </Text>
                </>
              ) : (
                <>
                  <CustomIcon
                    m={0}
                    name="check-circle-solid"
                    boxSize={3}
                    color="success.main"
                  />
                  <Text variant="body2" color="success.main">
                    Success
                  </Text>
                </>
              )}
            </Flex>
            <DotSeparator />
          </>
        )}
        {txData.timestamp ? (
          <>
            <Flex alignItems="center" gap={1}>
              <CustomIcon name="history" boxSize={3} color="gray.600" />
              <Text
                display="inline"
                variant={{ base: "body3", md: "body2" }}
                color="text.dark"
              >
                {dateFromNow(txData.timestamp)}
              </Text>
            </Flex>
            <DotSeparator />
            <Text
              display="inline"
              variant={{ base: "body3", md: "body2" }}
              color="text.dark"
            >
              {formatUTC(txData.timestamp)}
            </Text>
          </>
        ) : (
          <p>N/A</p>
        )}
      </Flex>
    </Flex>
  );
};
