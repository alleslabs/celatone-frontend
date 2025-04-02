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
    display: "flex",
    alignItems: "center",
    padding: 0,
  },
});

interface BlockDetailsTopProps {
  blockData: BlockData;
}

export const BlockDetailsTop = ({ blockData }: BlockDetailsTopProps) => {
  const block = Number(blockData.height);
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const openRestPage = () => {
    trackUseViewJSON("Block details");
    openNewTab(
      `${restEndpoint}/cosmos/base/tendermint/v1beta1/blocks/${blockData.height}`
    );
  };

  const disablePrevious = block <= 1;
  return (
    <Flex
      justify="space-between"
      mb={8}
      pb={8}
      borderBottomColor="gray.700"
      borderBottomWidth="1px"
    >
      <Flex direction="column" gap={1} w="full">
        <Flex
          justify="space-between"
          align="center"
          width="full"
          mt={{ base: 2, md: 5 }}
          mb={{ base: 2, md: 0 }}
        >
          <Flex align="center">
            <CustomIcon name="block" boxSize={5} color="primary.main" />
            <Heading
              as="h5"
              variant={{ base: "h6", md: "h5" }}
              className="ellipsis"
            >
              {blockData.height}
            </Heading>
          </Flex>
          <Flex gap={{ base: 1, md: 2 }} align="center">
            {!disablePrevious && (
              <AppLink href={`/blocks/${block - 1}`}>
                <StyledIconButton
                  aria-label="button"
                  icon={<CustomIcon name="chevron-left" />}
                  variant="ghost-gray"
                />
              </AppLink>
            )}
            <AppLink href={`/blocks/${block + 1}`}>
              <StyledIconButton
                aria-label="button"
                icon={<CustomIcon name="chevron-right" />}
                variant="ghost-gray"
              />
            </AppLink>
            <Button
              variant="ghost-gray"
              size={{ base: "sm", md: "md" }}
              rightIcon={<CustomIcon name="launch" boxSize={3} />}
              onClick={openRestPage}
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
            variant="body2"
            fontWeight={500}
            color="text.dark"
            display="inline"
          >
            Block hash:
          </Text>
          <CopyLink
            value={blockData.hash.toUpperCase()}
            amptrackSection="block_details_top"
            type="block_hash"
          />
        </Flex>
        <Flex gap={2} mt={1} alignItems="center">
          <Flex gap={1} alignItems="center">
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
