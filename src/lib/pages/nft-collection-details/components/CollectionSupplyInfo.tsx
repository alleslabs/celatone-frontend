import { Divider, Flex, Stack, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { TooltipInfo } from "lib/components/Tooltip";

const InfoComponent = ({
  title,
  tooltip,
  content,
}: {
  title: string;
  tooltip: string;
  content?: number;
}) => (
  <div>
    <Flex align="center" gap="4px">
      <Text
        whiteSpace="nowrap"
        color="gray.400"
        variant="body2"
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
  totalBurned: number;
  totalMinted: number;
  currentSupply: number;
  maxSupply?: number;
}

export const CollectionSupplyInfo = ({
  totalBurned,
  totalMinted,
  currentSupply,
  maxSupply,
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
    <Stack p="16px" spacing="16px" borderRadius="8px" bg="gray.900">
      <div>
        <Flex fontSize="14px" fontWeight={600} align="center" gap="4px">
          <Text color="gray.400">Current Supply (Minted - Burned)</Text>
          <TooltipInfo label={currentSupplyTooltip} />
        </Flex>
        <Flex fontWeight={600} align="end" gap="8px">
          <Text fontSize="16px">{currentSupply}</Text>
          <Text fontSize="12px" color="gray.400">
            ({totalMinted} - {totalBurned})
          </Text>
        </Flex>
      </div>
      <Divider opacity={1} borderColor="gray.700" />
      <div>
        <Flex fontSize="14px" fontWeight={600} align="center" gap="4px">
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
      mt="24px"
      p="16px"
      w="100%"
      bg="gray.900"
      borderRadius="8px"
      overflow="auto"
    >
      <Flex gap="40px" align="center" w="100%">
        <InfoComponent
          title="Current Supply"
          content={currentSupply}
          tooltip={currentSupplyTooltip}
        />
        <Text fontSize="24px" fontWeight={600} color="gray.100">
          =
        </Text>
        <InfoComponent
          title="Total Minted"
          content={totalMinted}
          tooltip={totalMintedTooltip}
        />
        <Text fontSize="24px" fontWeight={600} color="gray.100">
          -
        </Text>
        <InfoComponent
          title="Total Burned"
          content={totalBurned}
          tooltip={totalBurnedTooltip}
        />
      </Flex>

      <Flex w="248px" gap="48px" align="center" ml="48px">
        <Divider orientation="vertical" height="47px" borderWidth="1px" />
        <InfoComponent
          title="Max Supply"
          content={maxSupply}
          tooltip={maxSupplyTooltip}
        />
      </Flex>
    </Flex>
  );
};
