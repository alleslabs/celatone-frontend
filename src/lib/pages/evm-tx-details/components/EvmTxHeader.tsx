import type { FlexProps } from "@chakra-ui/react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";

import { trackUseViewJSON } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { DotSeparator } from "lib/components/DotSeparator";
import { CustomIcon } from "lib/components/icon";
import type { TxData, TxDataJsonRpc } from "lib/services/types";
import { dateFromNow, formatEvmTxHash, formatUTC } from "lib/utils";

interface EvmTxHeaderProps extends FlexProps {
  cosmosTxData: TxData;
  evmTxData: TxDataJsonRpc;
}

export const EvmTxHeader = ({
  cosmosTxData,
  evmTxData,
  ...flexProps
}: EvmTxHeaderProps) => {
  const isMobile = useMobile();

  const isTxFailed = !evmTxData.txReceipt.status;

  return (
    <Flex gap={2} direction="column" {...flexProps}>
      <Flex align="center" justify="space-between">
        <Flex gap={2} mb={{ base: 2, md: 0 }}>
          <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
            EVM Transaction Details
          </Heading>
          {isMobile && (
            <Flex
              align="center"
              gap={1}
              color={isTxFailed ? "error.main" : "success.main"}
            >
              {isTxFailed ? (
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
              trackUseViewJSON("evm_tx_page_transaction_hash");
              const jsonString = JSON.stringify(evmTxData, null, 2);
              const jsonWindow = window.open();
              if (jsonWindow) {
                // Modify styling later
                jsonWindow.document.write(
                  `<html><head><title>Evm Transaction Details</title>`
                );

                // Add styling
                jsonWindow.document.write(
                  "<style>body { background-color: #f0f0f0; color: #333; }</style>"
                );

                jsonWindow.document.write(
                  `</head><body><pre>${jsonString}</pre></body></html>`
                );
              }
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
          value={formatEvmTxHash(evmTxData.tx.hash)}
          amptrackSection="tx_header"
        />
      </Flex>
      <Flex align="center" gap={2} color="text.dark" fontSize="14px">
        {!isMobile && (
          <Flex
            align="center"
            gap={1}
            color={isTxFailed ? "error.main" : "success.main"}
          >
            {isTxFailed ? (
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
        <Flex alignItems="center" gap={1}>
          <CustomIcon name="history" boxSize={3} color="gray.600" />
          <Text
            display="inline"
            variant={{ base: "body3", md: "body2" }}
            color="text.dark"
          >
            {dateFromNow(cosmosTxData.timestamp)}
          </Text>
        </Flex>
        <DotSeparator />
        <Text
          display="inline"
          variant={{ base: "body3", md: "body2" }}
          color="text.dark"
        >
          {formatUTC(cosmosTxData.timestamp)}
        </Text>
      </Flex>
    </Flex>
  );
};
