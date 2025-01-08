import {
  Button,
  chakra,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";

import { trackUseViewJSON } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CopyLink } from "lib/components/CopyLink";
import { DotSeparator } from "lib/components/DotSeparator";
import { CustomIcon } from "lib/components/icon";
import type { BlockData } from "lib/types";
import { dateFromNow, formatUTC, openNewTab } from "lib/utils";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    alignItems: "center",
    display: "flex",
    padding: 0,
  },
});

interface BlockDetailsTopProps {
  blockData: BlockData;
}

export const BlockDetailsTop = ({ blockData }: BlockDetailsTopProps) => {
  const block = Number(blockData.height);
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

  const openLcdPage = () => {
    trackUseViewJSON("Block Details");
    openNewTab(
      `${lcdEndpoint}/cosmos/base/tendermint/v1beta1/blocks/${blockData.height}`
    );
  };

  const disablePrevious = block <= 1;
  return (
    <Flex
      borderBottomWidth="1px"
      justify="space-between"
      mb={8}
      pb={8}
      borderBottomColor="gray.700"
    >
      <Flex gap={1} w="full" direction="column">
        <Flex
          width="full"
          align="center"
          justify="space-between"
          mb={{ base: 2, md: 0 }}
          mt={{ base: 2, md: 5 }}
        >
          <Flex align="center">
            <CustomIcon name="block" boxSize={5} color="primary.main" />
            <Heading
              className="ellipsis"
              as="h5"
              variant={{ base: "h6", md: "h5" }}
            >
              {blockData.height}
            </Heading>
          </Flex>
          <Flex align="center" gap={{ base: 1, md: 2 }}>
            {!disablePrevious && (
              <AppLink href={`/blocks/${block - 1}`}>
                <StyledIconButton
                  aria-label="button"
                  variant="ghost-gray"
                  icon={<CustomIcon name="chevron-left" />}
                />
              </AppLink>
            )}
            <AppLink href={`/blocks/${block + 1}`}>
              <StyledIconButton
                aria-label="button"
                variant="ghost-gray"
                icon={<CustomIcon name="chevron-right" />}
              />
            </AppLink>
            <Button
              size={{ base: "sm", md: "md" }}
              variant="ghost-gray"
              onClick={openLcdPage}
              rightIcon={<CustomIcon name="launch" boxSize={3} />}
            >
              View in JSON
            </Button>
          </Flex>
        </Flex>
        <Flex
          gap={{ base: 0, md: 2 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text
            display="inline"
            variant="body2"
            color="text.dark"
            fontWeight={500}
          >
            Block Hash:
          </Text>
          <CopyLink
            type="block_hash"
            value={blockData.hash.toUpperCase()}
            amptrackSection="block_details_top"
          />
        </Flex>
        <Flex alignItems="center" gap={2} mt={1}>
          <Flex alignItems="center" gap={1}>
            <CustomIcon name="history" boxSize={3} color="gray.600" />
            <Text variant={{ base: "body3", md: "body2" }} color="text.dark">
              {dateFromNow(blockData.timestamp)}
            </Text>
          </Flex>
          <DotSeparator />
          <Text variant={{ base: "body3", md: "body2" }} color="text.dark">
            {formatUTC(blockData.timestamp)}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
