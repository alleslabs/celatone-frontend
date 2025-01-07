import { Flex, Text } from "@chakra-ui/react";

interface SearchZeroStateProps {
  isEvm: boolean;
  isFullTier: boolean;
  isGov: boolean;
  isMove: boolean;
  isNft: boolean;
  isPool: boolean;
  isWasm: boolean;
}

export const SearchZeroState = ({
  isEvm,
  isFullTier,
  isGov,
  isMove,
  isNft,
  isPool,
  isWasm,
}: SearchZeroStateProps) => {
  const base = ["Account Address", "Block Height", "TX Hash"];
  const govText = isGov ? ["Validator Address", "Proposal ID"] : [];
  const wasmText = isWasm ? ["Code ID", "Contract Address"] : [];
  const moveText = isMove ? ["Module Path"] : [];
  const evmText = isEvm ? ["EVM TX Hash", "Contract Address"] : [];
  const poolText = isPool && isFullTier ? ["Pool ID"] : [];
  const nftCollectionText = isNft
    ? ["NFT Collection Address", "NFT Address"]
    : [];

  const supportedItemsType = base.concat(
    govText,
    wasmText,
    moveText,
    evmText,
    poolText,
    nftCollectionText
  );

  return (
    <Flex gap={4} py={8} direction="column">
      <Text color="text.dark"> Please enter keyword, You can search with:</Text>
      <Flex
        px={4}
        py={2}
        border="1px solid"
        borderColor="gray.700"
        borderRadius={8}
        direction="column"
      >
        {supportedItemsType.map((item) => (
          <Flex key={item} alignItems="center" gap={3}>
            <Flex h={1} w={1} bgColor="primary.darker" borderRadius="full" />
            <Text color="text.dark">{item}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
