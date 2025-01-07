import { Divider, Flex, Stack, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { TooltipInfo } from "lib/components/Tooltip";

const InfoComponent = ({
  content,
  title,
  tooltip,
}: {
  content?: number;
  title: string;
  tooltip: string;
}) => (
  <div>
    <Flex align="center" gap="4px">
      <Text
        variant="body2"
        whiteSpace="nowrap"
        color="gray.400"
        fontWeight={600}
      >
        {title}
      </Text>
      <TooltipInfo label={tooltip} />
    </Flex>
    <Text color="gray.100" fontSize="18px" fontWeight={600}>
      {content ?? "∞"}
    </Text>
  </div>
);

interface CollectionSupplyInfoProps {
  currentSupply: number;
  maxSupply?: number;
  totalBurned: number;
  totalMinted: number;
}

export const CollectionSupplyInfo = ({
  currentSupply,
  maxSupply,
  totalBurned,
  totalMinted,
}: CollectionSupplyInfoProps) => {
  const isMobile = useMobile();

  const currentSupplyTooltip =
    "Number of NFTs currently available in the market. Calculated by subtracting total burned NFTs from the total minted.";
  const totalMintedTooltip =
    "Count of all NFTs ever minted, including those sold, held, or burned.";
  const totalBurnedTooltip =
    "Number of NFTs permanently removed from the collection.";
  const maxSupplyTooltip =
    "The maximum number of NFTs that can ever be minted in this collection.";

  return isMobile ? (
    <Stack bg="gray.900" p="16px" spacing="16px" borderRadius="8px">
      <div>
        <Flex align="center" gap="4px" fontSize="14px" fontWeight={600}>
          <Text color="gray.400">Current Supply (Minted - Burned)</Text>
          <TooltipInfo label={currentSupplyTooltip} />
        </Flex>
        <Flex align="end" gap="8px" fontWeight={600}>
          <Text fontSize="16px">{currentSupply}</Text>
          <Text color="gray.400" fontSize="12px">
            ({totalMinted} - {totalBurned})
          </Text>
        </Flex>
      </div>
      <Divider borderColor="gray.700" opacity={1} />
      <div>
        <Flex align="center" gap="4px" fontSize="14px" fontWeight={600}>
          <Text color="gray.400">Max Supply</Text>
          <TooltipInfo label={maxSupplyTooltip} />
        </Flex>
        <Text fontSize="18px" fontWeight={600}>
          {maxSupply ?? "∞"}
        </Text>
      </div>
    </Stack>
  ) : (
    <Flex
      align="center"
      bg="gray.900"
      mt="24px"
      p="16px"
      w="100%"
      borderRadius="8px"
      overflow="auto"
    >
      <Flex align="center" gap="40px" w="100%">
        <InfoComponent
          title="Current Supply"
          content={currentSupply}
          tooltip={currentSupplyTooltip}
        />
        <Text color="gray.100" fontSize="24px" fontWeight={600}>
          =
        </Text>
        <InfoComponent
          title="Total Minted"
          content={totalMinted}
          tooltip={totalMintedTooltip}
        />
        <Text color="gray.100" fontSize="24px" fontWeight={600}>
          -
        </Text>
        <InfoComponent
          title="Total Burned"
          content={totalBurned}
          tooltip={totalBurnedTooltip}
        />
      </Flex>

      <Flex align="center" gap="48px" ml="48px" w="248px">
        <Divider borderWidth="1px" height="47px" orientation="vertical" />
        <InfoComponent
          title="Max Supply"
          content={maxSupply}
          tooltip={maxSupplyTooltip}
        />
      </Flex>
    </Flex>
  );
};
