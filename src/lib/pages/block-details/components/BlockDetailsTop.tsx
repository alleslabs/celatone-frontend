import {
  chakra,
  Flex,
  Heading,
  IconButton,
  Text,
  Button,
} from "@chakra-ui/react";

import { useLCDEndpoint } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { DotSeparator } from "lib/components/DotSeparator";
import { CustomIcon } from "lib/components/icon";
import { openNewTab } from "lib/hooks";
import type { BlockDetails } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    padding: 0,
  },
});

interface BlockDetailsTopProps {
  blockData: BlockDetails;
}

export const BlockDetailsTop = ({ blockData }: BlockDetailsTopProps) => {
  const block = Number(blockData.height);
  const lcdEndpoint = useLCDEndpoint();
  const openLcdPage = () =>
    openNewTab(
      `${lcdEndpoint}/cosmos/base/tendermint/v1beta1/blocks/${blockData.height}`
    );

  return (
    <Flex
      justify="space-between"
      mb={12}
      pb={12}
      mt={6}
      borderBottomColor="pebble.700"
      borderBottomWidth="1px"
    >
      <Flex direction="column" gap={1}>
        <Flex alignItems="center">
          <CustomIcon name="block" boxSize="5" color="lilac.main" />
          <Heading as="h5" variant="h5" className="ellipsis">
            {blockData.height}
          </Heading>
        </Flex>
        <Flex gap={2}>
          <Text variant="body2" color="text.dark">
            Block Hash:
          </Text>
          <Text variant="body2" color="lilac.main">
            {blockData.hash.toUpperCase()}
          </Text>
        </Flex>
        <Flex gap={2} alignItems="center">
          <Flex gap={1} alignItems="center">
            <CustomIcon name="history" boxSize={3} color="pebble.600" />
            <Text variant="body2" color="text.dark">
              {dateFromNow(blockData.timestamp)}
            </Text>
          </Flex>
          <DotSeparator />
          <Text variant="body2" color="text.dark">
            {formatUTC(blockData.timestamp)}
          </Text>
        </Flex>
      </Flex>
      <Flex gap={2}>
        <AppLink href={`/block/${block - 1}`}>
          <StyledIconButton
            icon={<CustomIcon name="chevron-left" />}
            variant="ghost-gray"
          />
        </AppLink>
        <AppLink href={`/block/${block + 1}`}>
          <StyledIconButton
            icon={<CustomIcon name="chevron-right" />}
            variant="ghost-gray"
          />
        </AppLink>
        <Button
          variant="ghost-gray"
          padding={2}
          rightIcon={<CustomIcon name="launch" boxSize={3} color="text.dark" />}
          onClick={openLcdPage}
        >
          View in JSON
        </Button>
      </Flex>
    </Flex>
  );
};
