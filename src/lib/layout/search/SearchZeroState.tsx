import { Flex, Text } from "@chakra-ui/react";

interface SearchZeroStateProps {
  isWasm: boolean;
  isPool: boolean;
  isMove: boolean;
  isGov: boolean;
  isNft: boolean;
  isFullTier: boolean;
}

export const SearchZeroState = ({
  isWasm,
  isPool,
  isMove,
  isGov,
  isNft,
  isFullTier,
}: SearchZeroStateProps) => {
  const base = ["Account Address", "TX Hash", "Block Height"];
  const govText = isGov ? ["Validator Address", "Proposal ID"] : [];
  const wasmText = isWasm ? ["Code ID", "Contract Address"] : [];
  const moveText = isMove ? ["Module Path"] : [];
  const poolText = isPool && isFullTier ? ["Pool ID"] : [];
  const nftCollectionText = isNft ? ["NFT Collection Address"] : [];

  const supportedItemsType = base.concat(
    govText,
    wasmText,
    moveText,
    poolText,
    nftCollectionText
  );

  return (
    <Flex direction="column" gap={4} py={8}>
      <Text color="text.dark"> Please enter keyword, You can search with:</Text>
      <Flex
        direction="column"
        px={4}
        py={2}
        border="1px solid"
        borderColor="gray.700"
        borderRadius={8}
      >
        {supportedItemsType.map((item) => (
          <Flex alignItems="center" gap={3} key={item}>
            <Flex w={1} h={1} borderRadius="full" bgColor="primary.darker" />
            <Text color="text.dark">{item}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
