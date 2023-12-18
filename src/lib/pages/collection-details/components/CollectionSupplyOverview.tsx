import { Divider, Flex, Stack, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

const InfoComponent = ({
  title,
  content,
}: {
  title: string;
  content?: number;
}) => (
  <Stack spacing={0}>
    <Flex align="center" gap="4px">
      <Text
        whiteSpace="nowrap"
        color="gray.400"
        fontSize="14px"
        fontWeight={600}
        fontFamily="Manrope"
      >
        {title}
      </Text>
      <CustomIcon name="info-circle-solid" boxSize="12px" color="gray.600" />
    </Flex>
    <Text color="gray.100" fontSize="18px" fontWeight={600}>
      {content ?? "∞"}
    </Text>
  </Stack>
);

const CollectionSupplyOverview = ({
  totalBurnedCount,
  totlaMinted,
  currentSupply,
  maxSupply,
}: {
  totalBurnedCount: number;
  totlaMinted: number;
  currentSupply: number;
  maxSupply?: number;
}) => {
  return (
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
        <InfoComponent title="Current Supply" content={currentSupply} />
        <Text fontSize="24px" fontWeight={600} color="gray.100">
          =
        </Text>
        <InfoComponent title="Total Minted" content={totlaMinted} />
        <Text fontSize="24px" fontWeight={600} color="gray.100">
          -
        </Text>
        <InfoComponent title="Total Burned" content={totalBurnedCount} />
      </Flex>

      <Flex w="248px" gap="48px" align="center" ml="48px">
        <Divider orientation="vertical" height="47px" borderWidth="1px" />
        <InfoComponent title="Max Supply" content={maxSupply} />
      </Flex>
    </Flex>
  );
};

export default CollectionSupplyOverview;
