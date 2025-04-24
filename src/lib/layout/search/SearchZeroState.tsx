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
  const base = ["Account address", "Block height", "Tx hash"];
  const govText = isGov ? ["Validator address", "Proposal ID"] : [];
  const wasmText = isWasm ? ["Code ID", "Contract address"] : [];
  const moveText = isMove ? ["Module path"] : [];
  const evmText = isEvm ? ["EVM tx hash", "Contract address"] : [];
  const poolText = isPool && isFullTier ? ["Pool ID"] : [];
  const nftCollectionText = isNft
    ? ["NFT collection address", "NFT address"]
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
    <Flex direction="column" gap={4} py={8}>
      <Text color="text.dark"> Please enter keyword, You can search with:</Text>
      <Flex
        border="1px solid"
        borderColor="gray.700"
        borderRadius={8}
        direction="column"
        px={4}
        py={2}
      >
        {supportedItemsType.map((item) => (
          <Flex key={item} alignItems="center" gap={3}>
            <Flex bgColor="primary.darker" borderRadius="full" h={1} w={1} />
            <Text color="text.dark">{item}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
