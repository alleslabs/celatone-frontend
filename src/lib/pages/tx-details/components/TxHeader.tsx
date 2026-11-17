import type { FlexProps } from "@chakra-ui/react";
import type { PartialTxData, TxData } from "lib/services/types";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { trackUseViewJSON } from "lib/amplitude";
import { useEvmConfig, useMobile } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { useOpenTxTab } from "lib/hooks";
import { dateFromNow, formatUTC } from "lib/utils";

interface TxHeaderProps extends FlexProps {
  txData: PartialTxData | TxData;
}

const DotSeparator = () => (
  <Box bg="primary.darker" borderRadius="50%" h={1} w={1} />
);

const TxStatus = ({ txData }: Pick<TxHeaderProps, "txData">) => {
  if (txData.isPartial)
    return (
      <Flex align="center" gap={1}>
        <CustomIcon boxSize={3} color="gray.600" m={0} name="info-circle" />
        <Text color="text.dark" variant="body2">
          Status unknown
        </Text>
      </Flex>
    );

  const color = txData.isTxFailed ? "error.main" : "success.main";
  return (
    <Flex align="center" gap={1}>
      <CustomIcon
        boxSize={3}
        color={color}
        m={0}
        name={txData.isTxFailed ? "close-circle-solid" : "check-circle-solid"}
      />
      <Text color={color} variant="body2">
        {txData.isTxFailed ? "Failed" : "Success"}
      </Text>
    </Flex>
  );
};

export const TxHeader = ({ txData, ...flexProps }: TxHeaderProps) => {
  const isMobile = useMobile();
  const evm = useEvmConfig({ shouldRedirect: false });
  const openRestTab = useOpenTxTab("rest");

  return (
    <Flex direction="column" gap={2} {...flexProps}>
      <Flex align="center" justify="space-between">
        <Flex gap={2} mb={{ base: 2, md: 0 }} mt={{ base: 2, md: 4 }}>
          <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
            {evm.enabled ? "Cosmos transaction " : "Transaction "}details
          </Heading>
          {isMobile && <TxStatus txData={txData} />}
        </Flex>
        {!isMobile && (
          <Button
            rightIcon={<CustomIcon boxSize={3} m={0} name="launch" />}
            variant="ghost-gray"
            onClick={() => {
              trackUseViewJSON("tx_page_transaction_hash");
              openRestTab(txData.txhash);
            }}
          >
            View in JSON
          </Button>
        )}
      </Flex>
      <Flex
        direction={{ base: "column", md: "row" }}
        fontSize="14px"
        gap={{ base: 1, md: 2 }}
        w="full"
      >
        <Text color="text.dark" fontWeight={500} variant="body2">
          Transaction hash:
        </Text>
        <CopyLink
          amptrackSection="tx_header"
          type="tx_hash"
          value={txData.txhash}
        />
      </Flex>
      <Flex align="center" color="text.dark" fontSize="14px" gap={2}>
        {!isMobile && (
          <>
            <TxStatus txData={txData} />
            <DotSeparator />
          </>
        )}
        {txData.isPartial ? (
          <Text
            color="text.dark"
            display="inline"
            variant={{ base: "body3", md: "body2" }}
          >
            Timestamp unavailable
          </Text>
        ) : txData.timestamp ? (
          <>
            <Flex alignItems="center" gap={1}>
              <CustomIcon boxSize={3} color="gray.600" name="history" />
              <Text
                color="text.dark"
                display="inline"
                variant={{ base: "body3", md: "body2" }}
              >
                {dateFromNow(txData.timestamp)}
              </Text>
            </Flex>
            <DotSeparator />
            <Text
              color="text.dark"
              display="inline"
              variant={{ base: "body3", md: "body2" }}
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
