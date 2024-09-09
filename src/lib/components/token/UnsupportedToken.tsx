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
      {...props}
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
            wordBreak="break-word"
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
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text variant="body2" fontWeight="900">
          {formatUTokenWithPrecision(token.amount, token.precision ?? 0, false)}
        </Text>
        {!isMobile && (
          <Text
            variant="body3"
            color="text.dark"
            minW="fit-content"
            my={{ base: 1, md: 0 }}
          >
            {`${tokenType} Token`}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
