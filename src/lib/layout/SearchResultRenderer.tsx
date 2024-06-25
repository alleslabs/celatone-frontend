/* eslint-disable sonarjs/no-duplicate-string */
import { Flex, Image, Text } from "@chakra-ui/react";

import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { PrimaryNameMark } from "lib/components/PrimaryNameMark";
import { EmptyState } from "lib/components/state";
import type {
  ResultMetadata,
  SearchResultType,
} from "lib/services/searchService";
import type { Nullable, Option } from "lib/types";

interface ResultItemProps {
  index: number;
  type: SearchResultType;
  value: string;
  cursor: Option<number>;
  metadata: ResultMetadata;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
  onClose?: () => void;
}

export const getRouteOptions = (
  type: Option<SearchResultType>
): Nullable<{ pathname: string; query: string[] }> => {
  switch (type) {
    case "Account Address":
      return {
        pathname: "/accounts/[accountAddress]",
        query: ["accountAddress"],
      };
    case "Transaction Hash":
      return { pathname: "/txs/[txHash]", query: ["txHash"] };
    case "Code ID":
      return { pathname: "/codes/[codeId]", query: ["codeId"] };
    case "Contract Address":
      return {
        pathname: "/contracts/[contractAddress]",
        query: ["contractAddress"],
      };
    case "Block":
      return { pathname: "/blocks/[height]", query: ["height"] };
    case "Proposal ID":
      return { pathname: "/proposals/[proposalId]", query: ["proposalId"] };
    case "Validator Address":
      return {
        pathname: "/validators/[validatorAddress]",
        query: ["validatorAddress"],
      };
    case "Pool ID":
      return { pathname: "/pools/[poolId]", query: ["poolId"] };
    case "Module Path":
      return {
        pathname: "/modules/[address]/[moduleName]",
        query: ["address", "moduleName"],
      };
    default:
      return null;
  }
};

const getIcon = (type: Option<SearchResultType>) => {
  switch (type) {
    case "Account Address":
      return "admin" as IconKeys;
    case "Transaction Hash":
      return "file" as IconKeys;
    case "Code ID":
      return "code" as IconKeys;
    case "Contract Address":
    case "Module Path":
      return "contract-address" as IconKeys;
    case "Block":
      return "block" as IconKeys;
    case "Proposal ID":
      return "proposal" as IconKeys;
    case "Validator Address":
      return "validator" as IconKeys;
    case "Pool ID":
      return "pool" as IconKeys;
    default:
      return "list" as IconKeys;
  }
};

const DisplayResult = ({
  metadata,
  value,
  type,
  isAccountAddress,
}: {
  metadata: ResultMetadata;
  value: string;
  type: SearchResultType;
  isAccountAddress: boolean;
}) => {
  const normalizedIcnsValue = value.endsWith(`.${metadata.icns.bech32Prefix}`)
    ? value
    : `${value}.${metadata.icns.bech32Prefix}`;

  if (isAccountAddress && metadata.initiaUsername.address)
    return (
      <Flex direction="column">
        <Text variant="body2">{metadata.initiaUsername.username}</Text>
        <Flex
          gap={{ base: 0, md: 1 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text variant="body2" color="text.dark" wordBreak="break-all">
            {metadata.initiaUsername.username
              ? `(${metadata.initiaUsername.address})`
              : metadata.initiaUsername.address}
          </Text>
          <Text
            variant="body2"
            fontWeight={{ base: "auto", md: 500 }}
            color="text.disabled"
          >
            <span>–</span> {type}
          </Text>
        </Flex>
      </Flex>
    );

  if (isAccountAddress && metadata.icns.icnsNames?.primaryName)
    return (
      <Flex direction="column">
        <Flex gap={1}>
          <Flex gap={1} align="center">
            <PrimaryNameMark />
            <Text variant="body2">{metadata.icns.icnsNames.primaryName}</Text>
          </Flex>
          {value !== metadata.icns.address &&
            normalizedIcnsValue !== metadata.icns.icnsNames?.primaryName && (
              <Text
                variant="body2"
                _before={{
                  content: '"/"',
                  fontSize: "12px",
                  color: "text.dark",
                  mr: 1,
                }}
              >
                {normalizedIcnsValue}
              </Text>
            )}
        </Flex>
        <Flex
          gap={{ base: 0, md: 1 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text variant="body2" color="text.dark" wordBreak="break-all">
            {metadata.icns.icnsNames.primaryName
              ? `(${metadata.icns.address})`
              : metadata.icns.address}
          </Text>
          <Text
            variant="body2"
            fontWeight={{ base: "auto", md: 500 }}
            color="text.disabled"
          >
            <span>–</span> {type}
          </Text>
        </Flex>
      </Flex>
    );

  if (
    isAccountAddress ||
    type === "Validator Address" ||
    type === "Transaction Hash" ||
    type === "Module Path"
  )
    return (
      <Flex gap={{ base: 0, md: 1 }} direction={{ base: "column", md: "row" }}>
        <Text variant="body2" wordBreak="break-all">
          {value}
        </Text>
        <Text
          variant="body2"
          fontWeight={{ base: "auto", md: 500 }}
          color="text.disabled"
        >
          <span>–</span> {type}
        </Text>
      </Flex>
    );

  return (
    <Flex gap={1}>
      <Text variant="body2" wordBreak="break-all">
        {value}
      </Text>
      <Text
        variant="body2"
        fontWeight={{ base: "auto", md: 500 }}
        color="text.disabled"
      >
        <span>–</span> {type}
      </Text>
    </Flex>
  );
};

const ResultItem = ({
  index,
  type,
  value,
  cursor,
  metadata,
  setCursor,
  handleSelectResult,
  onClose,
}: ResultItemProps) => {
  const route = getRouteOptions(type)?.pathname;
  const isAccountAddress =
    type === "Account Address" || type === "Contract Address";

  return (
    <Flex id={`item-${index}`}>
      {route && (
        <Flex
          p={2}
          w="full"
          gap={2}
          alignItems="center"
          borderRadius="8px"
          _hover={{ bg: "gray.700", cursor: "pointer" }}
          cursor="pointer"
          transition="all 0.25s ease-in-out"
          bg={index === cursor ? "gray.700" : undefined}
          onMouseMove={() => index !== cursor && setCursor(index)}
          onClick={() => {
            handleSelectResult(type, true);
            onClose?.();
          }}
        >
          {isAccountAddress && metadata.initiaUsername?.username ? (
            <Image
              src="https://assets.alleslabs.dev/webapp-assets/name-services/initia-username.svg"
              borderRadius="full"
              width={5}
              height={5}
            />
          ) : (
            <CustomIcon name={getIcon(type)} color="gray.600" />
          )}
          <DisplayResult
            metadata={metadata}
            value={value}
            type={type}
            isAccountAddress={isAccountAddress}
          />
        </Flex>
      )}
    </Flex>
  );
};

export const SearchResultRenderer = ({
  results,
  keyword,
  cursor,
  metadata,
  setCursor,
  handleSelectResult,
  onClose,
}: {
  results: SearchResultType[];
  keyword: string;
  cursor: Option<number>;
  metadata: ResultMetadata;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
  onClose?: () => void;
}) => (
  <>
    {!results.length ? (
      <EmptyState
        imageVariant="not-found"
        textVariant="body2"
        message="Matches not found. Please check your spelling or make sure you have
            selected the correct network."
      />
    ) : (
      results.map((type, index) => (
        <ResultItem
          key={type}
          index={index}
          type={type}
          value={keyword}
          cursor={cursor}
          metadata={metadata}
          setCursor={setCursor}
          handleSelectResult={handleSelectResult}
          onClose={onClose}
        />
      ))
    )}
  </>
);
