import { Box, chakra, Flex, Image, Text } from "@chakra-ui/react";

import { NAToken } from "lib/icon";
import { useAssetInfos } from "lib/services/assetService";
import type { Option } from "lib/types";

const AssetLabel = chakra(Text, {
  baseStyle: {
    bg: "background.main",
    color: "text.dark",
    fontSize: "16px",
    fontWeight: "400",
    left: 0,
    lineHeight: "1.2",
    mt: 2,
    mx: 3,
    paddingInlineEnd: 1,
    paddingInlineStart: 1,
    pointerEvents: "none",
    position: "absolute",
    pt: 2,
    top: 0,
    transform: "scale(0.75) translateY(-29px)",
    transformOrigin: "left top",
  },
});

export const AssetBox = ({ baseDenom }: { baseDenom: Option<string> }) => {
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const tokenInfo = baseDenom ? assetInfos?.[baseDenom] : undefined;

  return (
    <Box
      h="56px"
      padding="16px 12px"
      w="full"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="8px"
      color={tokenInfo ? "text.main" : "gray.600"}
      fontSize="16px"
      position="relative"
    >
      <AssetLabel>Asset</AssetLabel>
      <Flex align="center" gap={1}>
        <Image fallback={<NAToken />} h="24px" src={tokenInfo?.logo} w="24px" />
        {tokenInfo?.symbol ?? "N/A"}
      </Flex>
    </Box>
  );
};
