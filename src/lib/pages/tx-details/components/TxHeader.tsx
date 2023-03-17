import type { FlexProps } from "@chakra-ui/react";
import { Button, Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { CELATONE_API_ENDPOINT, getChainApiPath } from "env";
import { useChainId } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { TxData } from "lib/services/txService";
import { dateFromNow, formatUTC } from "lib/utils";

interface TxHeaderProps extends FlexProps {
  txData: TxData;
}

const DotSeparator = () => (
  <Box bg="lilac.darker" borderRadius="50%" w="4px" h="4px" />
);

export const TxHeader = ({ txData, ...flexProps }: TxHeaderProps) => {
  const { currentChainName } = useWallet();
  const chainId = useChainId();
  const isTxFailed = Boolean(txData.code);
  const openLcdPage = () => {
    window.open(
      `${CELATONE_API_ENDPOINT}/txs/${getChainApiPath(
        currentChainName
      )}/${chainId}/${txData.txhash}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  return (
    <Flex direction="column" gap={2} {...flexProps}>
      <Flex justify="space-between" align="center">
        <Heading as="h5" variant="h5">
          Transaction Details
        </Heading>
        <Button
          variant="ghost-gray"
          rightIcon={
            <CustomIcon name="launch" boxSize={3} color="text.dark" m={0} />
          }
          onClick={openLcdPage}
        >
          View in JSON
        </Button>
      </Flex>
      <Flex gap={2} fontSize="14px" w="full">
        <Text variant="body2" fontWeight={500} color="text.dark">
          Transaction Hash:
        </Text>
        <ExplorerLink
          value={txData.txhash}
          type="tx_hash"
          textFormat="normal"
          maxWidth="full"
        />
      </Flex>
      <Flex gap={2} fontSize="14px" color="text.dark" align="center">
        <Flex align="center" gap={1}>
          {isTxFailed ? (
            <>
              <CustomIcon
                name="close-circle-solid"
                boxSize={3}
                m={0}
                color="error.main"
              />
              <p>Failed</p>
            </>
          ) : (
            <>
              <CustomIcon
                name="check-circle-solid"
                boxSize={3}
                m={0}
                color="success.main"
              />
              <p>Success</p>
            </>
          )}
        </Flex>
        <DotSeparator />
        {txData.timestamp ? (
          <>
            <p>{dateFromNow(txData.timestamp)}</p>
            <DotSeparator />
            <p>{formatUTC(txData.timestamp)}</p>
          </>
        ) : (
          <p>N/A</p>
        )}
      </Flex>
    </Flex>
  );
};
