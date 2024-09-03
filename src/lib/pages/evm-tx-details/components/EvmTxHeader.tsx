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
      <Flex justify="space-between" align="center">
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
                    name="close-circle-solid"
                    boxSize={3}
                    m={0}
                    color="error.main"
                  />
                  <Text variant="body2" color="error.main">
                    Failed
                  </Text>
                </>
              ) : (
                <>
                  <CustomIcon
                    name="check-circle-solid"
                    boxSize={3}
                    m={0}
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
            rightIcon={<CustomIcon name="launch" boxSize={3} m={0} />}
            onClick={() => {
              trackUseViewJSON("tx_page_transaction_hash");
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
        gap={{ base: 1, md: 2 }}
        fontSize="14px"
        w="full"
        direction={{ base: "column", md: "row" }}
      >
        <Text variant="body2" fontWeight={500} color="text.dark">
          Transaction Hash:
        </Text>
        <CopyLink
          value={formatEvmTxHash(evmTxData.tx.hash)}
          amptrackSection="tx_header"
          type="tx_hash"
        />
      </Flex>
      <Flex gap={2} fontSize="14px" color="text.dark" align="center">
        {!isMobile && (
          <Flex
            align="center"
            gap={1}
            color={isTxFailed ? "error.main" : "success.main"}
          >
            {isTxFailed ? (
              <>
                <CustomIcon
                  name="close-circle-solid"
                  boxSize={3}
                  m={0}
                  color="error.main"
                />
                <Text variant="body2" color="error.main">
                  Failed
                </Text>
              </>
            ) : (
              <>
                <CustomIcon
                  name="check-circle-solid"
                  boxSize={3}
                  m={0}
                  color="success.main"
                />
                <Text variant="body2" color="success.main">
                  Success
                </Text>
              </>
            )}
          </Flex>
        )}
        {cosmosTxData.timestamp ? (
          <>
            <Flex gap={1} alignItems="center">
              <CustomIcon name="history" boxSize={3} color="gray.600" />
              <Text
                variant={{ base: "body3", md: "body2" }}
                color="text.dark"
                display="inline"
              >
                {dateFromNow(cosmosTxData.timestamp)}
              </Text>
            </Flex>
            <DotSeparator />
            <Text
              variant={{ base: "body3", md: "body2" }}
              color="text.dark"
              display="inline"
            >
              {formatUTC(cosmosTxData.timestamp)}
            </Text>
          </>
        ) : (
          <p>N/A</p>
        )}
      </Flex>
    </Flex>
  );
};
