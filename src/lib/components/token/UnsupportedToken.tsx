import type { FlexProps } from "@chakra-ui/react";
import type { AddressReturnType } from "lib/app-provider";
import type { TokenWithValue } from "lib/types";

import { Flex, Tag, Text } from "@chakra-ui/react";
import { useEvmConfig, useGetAddressType, useMobile } from "lib/app-provider";
import {
  formatUTokenWithPrecision,
  getTokenLabel,
  getTokenType,
} from "lib/utils";

import { Copier } from "../copy";
import { CustomIcon } from "../icon";
import { Tooltip } from "../Tooltip";

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
  const evm = useEvmConfig({ shouldRedirect: false });
  const getAddressType = useGetAddressType();
  const tokenType = !token.denom.includes("/")
    ? getTokenTypeWithAddress(getAddressType(token.denom))
    : getTokenType(token.denom.split("/")[0]);

  return (
    <Flex
      className="copier-wrapper"
      _hover={{
        "& .info": {
          display: "flex",
        },
      }}
      bg="gray.900"
      borderRadius="8px"
      direction="column"
      px={4}
      py={3}
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
          justifyContent="center"
          minH={6}
          my={{ base: 1, md: 0 }}
        >
          <Text
            className={isMobile ? "" : "ellipsis"}
            color="text.dark"
            variant="body2"
            wordBreak="break-word"
          >
            {getTokenLabel(token.denom, token.symbol, !isMobile)}
          </Text>
          {!isMobile && (
            <Tooltip label={`Token ID: ${token.denom}`} maxW="500px">
              <Flex
                className="info"
                alignItems="center"
                cursor="pointer"
                display={{ base: "flex", md: "none" }}
                h={6}
              >
                <CustomIcon boxSize={3} color="gray.600" name="info-circle" />
              </Flex>
            </Tooltip>
          )}
          <Copier
            amptrackSection="unsupported_token_copy"
            copyLabel="Token ID copied!"
            display={{ base: "flex", md: "none" }}
            ml={{ base: 1, md: 0 }}
            type="unsupported_asset"
            value={token.denom}
          />
        </Flex>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontWeight="900" variant="body2">
          {formatUTokenWithPrecision({
            amount: token.amount,
            isEvm: evm.enabled,
            precision: token.precision ?? 0,
          })}
        </Text>
        {!isMobile && (
          <Text
            color="text.dark"
            minW="fit-content"
            my={{ base: 1, md: 0 }}
            variant="body3"
          >
            {`${tokenType} Token`}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
