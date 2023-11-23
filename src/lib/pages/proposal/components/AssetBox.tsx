import { Box, chakra, Flex, Image, Text } from "@chakra-ui/react";

import { NAToken } from "lib/icon";
import { useAssetInfos } from "lib/services/assetService";
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
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const tokenInfo = baseDenom ? assetInfos?.[baseDenom] : undefined;

  return (
    <Box
      h="56px"
      w="full"
      fontSize="16px"
      padding="16px 12px"
      borderRadius="8px"
      border="1px solid"
      borderColor="gray.700"
      position="relative"
      color={tokenInfo ? "text.main" : "gray.600"}
    >
      <AssetLabel>Asset</AssetLabel>
      <Flex align="center" gap={1}>
        <Image h="24px" w="24px" src={tokenInfo?.logo} fallback={<NAToken />} />
        {tokenInfo?.symbol ?? "N/A"}
      </Flex>
    </Box>
  );
};
