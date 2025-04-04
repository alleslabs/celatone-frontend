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
