import { Flex, Grid, Tag, Text } from "@chakra-ui/react";

import {
  useGetAddressType,
  type AddressReturnType,
  useMobile,
} from "lib/app-provider";
import { Copier } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import type { TokenWithValue } from "lib/types";
import {
  formatUTokenWithPrecision,
  getTokenLabel,
  getTokenType,
} from "lib/utils";

interface UnsupportedAssetSectionContentProps {
  unsupportedAssets: TokenWithValue[];
  isAccount?: boolean;
  onViewMore?: () => void;
}

const getTokenTypeWithAddress = (addrType: AddressReturnType) =>
  addrType === "contract_address"
    ? getTokenType("cw20")
    : getTokenType("native");

const UnsupportedToken = ({ token }: { token: TokenWithValue }) => {
  const getAddressType = useGetAddressType();
  const tokenType = !token.denom.includes("/")
    ? getTokenTypeWithAddress(getAddressType(token.denom))
    : getTokenType(token.denom.split("/")[0]);

  const isMobile = useMobile();
  return (
    <Flex
      className="copier-wrapper"
      borderRadius="8px"
      bg="gray.900"
      direction="column"
      px={4}
      py={3}
      role="group"
      _hover={{
        "& .info": {
          display: "flex",
        },
      }}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ base: "flex-start", md: "center" }}
      >
        {isMobile && (
          <Tag variant="gray" size="xs" my={{ base: 1, md: 0 }}>
            {`${tokenType} Token`}
          </Tag>
        )}
        <Flex
          alignItems="center"
          justifyContent="center"
          gap={1}
          minH={6}
          my={{ base: 1, md: 0 }}
        >
          <Text
            variant="body2"
            className={isMobile ? "" : "ellipsis"}
            wordBreak="break-all"
            color="text.dark"
          >
            {getTokenLabel(token.denom, token.symbol, !isMobile)}
          </Text>
          {!isMobile && (
            <Tooltip label={`Token ID: ${token.denom}`} maxW="500px">
              <Flex
                cursor="pointer"
                className="info"
                display={{ base: "flex", md: "none" }}
                h={6}
                alignItems="center"
              >
                <CustomIcon name="info-circle" boxSize={3} color="gray.600" />
              </Flex>
            </Tooltip>
          )}
          <Copier
            display={{ base: "flex", md: "none" }}
            type="unsupported_asset"
            value={token.denom}
            copyLabel="Token ID Copied!"
            ml={{ base: 1, md: 0 }}
            amptrackSection="unsupported_token_copy"
          />
        </Flex>
        {!isMobile && (
          <Text variant="body3" color="text.dark" my={{ base: 1, md: 0 }}>
            {`${tokenType} Token`}
          </Text>
        )}
      </Flex>
      <Text variant="body2" fontWeight="900">
        {formatUTokenWithPrecision(token.amount, token.precision ?? 0, false)}
      </Text>
    </Flex>
  );
};

export const UnsupportedAssetSectionContent = ({
  unsupportedAssets,
  onViewMore,
  isAccount = false,
}: UnsupportedAssetSectionContentProps) => {
  return unsupportedAssets.length ? (
    <Flex direction="column" gap={5} p={4}>
      <Grid
        gridGap={4}
        gridTemplateColumns={{
          base: "1 fr",
          md: onViewMore ? "1fr" : "repeat(2, 1fr)",
        }}
      >
        {unsupportedAssets.map((asset) => (
          <UnsupportedToken key={asset.denom} token={asset} />
        ))}
      </Grid>
    </Flex>
  ) : (
    <Flex p={12} alignItems="center" justifyContent="center">
      <Text variant="body2" color="text.dark">
        This {isAccount ? "address" : "contract"} does not hold any unsupported
        assets
      </Text>
    </Flex>
  );
};
