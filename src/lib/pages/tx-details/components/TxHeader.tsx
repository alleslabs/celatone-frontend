import type { FlexProps } from "@chakra-ui/react";
import { Button, Box, Flex, Heading, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { useOpenTxTab } from "lib/hooks";
import { AmpTrackViewJson } from "lib/services/amplitude";
import type { TxData } from "lib/services/txService";
import { dateFromNow, formatUTC } from "lib/utils";

interface TxHeaderProps extends FlexProps {
  txData: TxData;
}

const DotSeparator = () => (
  <Box bg="secondary.darker" borderRadius="50%" w={1} h={1} />
);

export const TxHeader = ({ txData, ...flexProps }: TxHeaderProps) => {
  const openLcdTab = useOpenTxTab("lcd");
  const isMobile = useMobile();
  return (
    <Flex direction="column" gap={2} {...flexProps}>
      <Flex justify="space-between" align="center">
        <Flex gap={2} mt={{ base: 2, md: 4 }} mb={{ base: 2, md: 0 }}>
          <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
            Transaction Details
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
              AmpTrackViewJson("tx_page_transaction_hash");
              openLcdTab(txData.txhash);
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
          value={txData.txhash}
          amptrackSection="tx_header"
          type="tx_hash"
        />
      </Flex>
      <Flex gap={2} fontSize="14px" color="text.dark" align="center">
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
            <DotSeparator />
          </>
        )}
        {txData.timestamp ? (
          <>
            <Flex gap={1} alignItems="center">
              <CustomIcon name="history" boxSize={3} color="gray.600" />
              <Text
                variant={{ base: "body3", md: "body2" }}
                color="text.dark"
                display="inline"
              >
                {dateFromNow(txData.timestamp)}
              </Text>
            </Flex>
            <DotSeparator />
            <Text
              variant={{ base: "body3", md: "body2" }}
              color="text.dark"
              display="inline"
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
