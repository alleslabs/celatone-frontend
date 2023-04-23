import { Box, chakra, Flex, Image, Text } from "@chakra-ui/react";

import { useNativeTokensInfo } from "lib/app-provider";
import type { Option } from "lib/types";

const AssetLabel = chakra(Text, {
  baseStyle: {
    top: 0,
    left: 0,
    mx: 3,
    pt: 2,
    mt: 2,
    paddingInlineStart: 1,
    paddingInlineEnd: 1,
    position: "absolute",
    fontWeight: "400",
    lineHeight: "1.2",
    pointerEvents: "none",
    transformOrigin: "left top",
    color: "text.dark",
    fontSize: "16px",
    transform: "scale(0.75) translateY(-29px)",
    bg: "background.main",
  },
});

export const AssetBox = ({ baseDenom }: { baseDenom: Option<string> }) => {
  const nativeTokensInfo = useNativeTokensInfo();
  const tokenInfo = nativeTokensInfo.find((asset) => asset.base === baseDenom);
  return (
    <Box
      h="56px"
      w="full"
      fontSize="16px"
      padding="16px 12px"
      borderRadius="8px"
      border="1px solid"
      borderColor="pebble.700"
      position="relative"
      color={tokenInfo ? "text.main" : "pebble.600"}
    >
      <AssetLabel>Asset</AssetLabel>
      <Flex align="center">
        <Image h="24px" w="24px" mr={1} src={tokenInfo?.logo_URIs?.png} />
        {tokenInfo?.symbol ?? "N/A"}
      </Flex>
    </Box>
  );
};
