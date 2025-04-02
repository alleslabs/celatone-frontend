import type { FlexProps } from "@chakra-ui/react";
import type { TxData, TxDataJsonRpc } from "lib/services/types";

import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { trackUseViewJSON } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { DotSeparator } from "lib/components/DotSeparator";
import { CustomIcon } from "lib/components/icon";
import { dateFromNow, formatEvmTxHash, formatUTC } from "lib/utils";

interface EvmTxHeaderProps extends FlexProps {
  evmTxData: TxDataJsonRpc;
  cosmosTxData: TxData;
}

export const EvmTxHeader = ({
  evmTxData,
  cosmosTxData,
  ...flexProps
}: EvmTxHeaderProps) => {
  const isMobile = useMobile();

  const isTxFailed = !evmTxData.txReceipt.status;

  return (
    <Flex direction="column" gap={2} {...flexProps}>
      <Flex align="center" justify="space-between">
        <Flex gap={2} mb={{ base: 2, md: 0 }}>
          <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
            EVM Transaction Details
          </Heading>
          {isMobile && (
            <Flex
              align="center"
              color={isTxFailed ? "error.main" : "success.main"}
              gap={1}
            >
              {isTxFailed ? (
                <>
                  <CustomIcon
                    boxSize={3}
                    color="error.main"
                    m={0}
                    name="close-circle-solid"
                  />
                  <Text color="error.main" variant="body2">
                    Failed
                  </Text>
                </>
              ) : (
                <>
                  <CustomIcon
                    boxSize={3}
                    color="success.main"
                    m={0}
                    name="check-circle-solid"
                  />
                  <Text color="success.main" variant="body2">
                    Success
                  </Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
        {!isMobile && (
          <Button
            rightIcon={<CustomIcon boxSize={3} m={0} name="launch" />}
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
          Transaction Hash:
        </Text>
        <CopyLink
          amptrackSection="tx_header"
          type="tx_hash"
          value={formatEvmTxHash(evmTxData.tx.hash)}
        />
      </Flex>
      <Flex align="center" color="text.dark" fontSize="14px" gap={2}>
        {!isMobile && (
          <Flex
            align="center"
            color={isTxFailed ? "error.main" : "success.main"}
            gap={1}
          >
            {isTxFailed ? (
              <>
                <CustomIcon
                  boxSize={3}
                  color="error.main"
                  m={0}
                  name="close-circle-solid"
                />
                <Text color="error.main" variant="body2">
                  Failed
                </Text>
              </>
            ) : (
              <>
                <CustomIcon
                  boxSize={3}
                  color="success.main"
                  m={0}
                  name="check-circle-solid"
                />
                <Text color="success.main" variant="body2">
                  Success
                </Text>
              </>
            )}
          </Flex>
        )}
        <Flex alignItems="center" gap={1}>
          <CustomIcon boxSize={3} color="gray.600" name="history" />
          <Text
            color="text.dark"
            display="inline"
            variant={{ base: "body3", md: "body2" }}
          >
            {dateFromNow(cosmosTxData.timestamp)}
          </Text>
        </Flex>
        <DotSeparator />
        <Text
          color="text.dark"
          display="inline"
          variant={{ base: "body3", md: "body2" }}
        >
          {formatUTC(cosmosTxData.timestamp)}
        </Text>
      </Flex>
    </Flex>
  );
};
