import { Flex, Text } from "@chakra-ui/react";

interface SearchZeroStateProps {
  isPool: boolean;
  isWasm: boolean;
  isMove: boolean;
  isEvm: boolean;
  isGov: boolean;
  isNft: boolean;
  isFullTier: boolean;
}

export const SearchZeroState = ({
  isPool,
  isWasm,
  isMove,
  isEvm,
  isGov,
  isNft,
  isFullTier,
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
