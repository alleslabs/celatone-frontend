import type { FlexProps } from "@chakra-ui/react";
import { Flex, Tag, Text } from "@chakra-ui/react";

import { Copier } from "../copy";
import { CustomIcon } from "../icon";
import { Tooltip } from "../Tooltip";
import type { AddressReturnType } from "lib/app-provider";
import { useGetAddressType, useMobile } from "lib/app-provider";
import type { TokenWithValue } from "lib/types";
import {
  formatUTokenWithPrecision,
  getTokenLabel,
  getTokenType,
} from "lib/utils";

const getTokenTypeWithAddress = (addrType: AddressReturnType) =>
  addrType === "contract_address"
    ? getTokenType("cw20")
    : getTokenType("native");

interface UnsupportedTokenProps extends FlexProps {
  token: TokenWithValue;
}

export const UnsupportedToken = ({
  token,
  ...props
}: UnsupportedTokenProps) => {
  const isMobile = useMobile();
  const getAddressType = useGetAddressType();
  const tokenType = !token.denom.includes("/")
    ? getTokenTypeWithAddress(getAddressType(token.denom))
    : getTokenType(token.denom.split("/")[0]);

  return (
    <Flex
      className="copier-wrapper"
      bg="gray.900"
      px={4}
      py={3}
      _hover={{
        "& .info": {
          display: "flex",
        },
      }}
      borderRadius="8px"
      direction="column"
      role="group"
      {...props}
    >
      <Flex
        alignItems={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
      >
        {isMobile && (
          <Tag my={{ base: 1, md: 0 }} size="xs" variant="gray">
            {`${tokenType} Token`}
          </Tag>
        )}
        <Flex
          alignItems="center"
          gap={1}
          minH={6}
          my={{ base: 1, md: 0 }}
          justifyContent="center"
        >
          <Text
            className={isMobile ? "" : "ellipsis"}
            variant="body2"
            color="text.dark"
            wordBreak="break-word"
          >
            {getTokenLabel(token.denom, token.symbol, !isMobile)}
          </Text>
          {!isMobile && (
            <Tooltip label={`Token ID: ${token.denom}`} maxW="500px">
              <Flex
                className="info"
                alignItems="center"
                display={{ base: "flex", md: "none" }}
                h={6}
                cursor="pointer"
              >
                <CustomIcon name="info-circle" boxSize={3} color="gray.600" />
              </Flex>
            </Tooltip>
          )}
          <Copier
            display={{ base: "flex", md: "none" }}
            ml={{ base: 1, md: 0 }}
            type="unsupported_asset"
            value={token.denom}
            amptrackSection="unsupported_token_copy"
            copyLabel="Token ID Copied!"
          />
        </Flex>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text variant="body2" fontWeight="900">
          {formatUTokenWithPrecision(token.amount, token.precision ?? 0, false)}
        </Text>
        {!isMobile && (
          <Text
            minW="fit-content"
            my={{ base: 1, md: 0 }}
            variant="body3"
            color="text.dark"
          >
            {`${tokenType} Token`}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
