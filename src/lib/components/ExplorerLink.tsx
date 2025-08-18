import type { FlexProps, TextProps } from "@chakra-ui/react";
import type { Option } from "lib/types";
import type { ReactNode } from "react";

import { Flex, Text } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { trackMintScan } from "lib/amplitude";
import { type AddressReturnType, useChainConfigs } from "lib/app-provider";
import { useCelatoneApp } from "lib/app-provider/contexts";
import { useWasmConfig } from "lib/app-provider/hooks/useConfig";
import { useCurrentChain } from "lib/app-provider/hooks/useCurrentChain";
import { useMobile } from "lib/app-provider/hooks/useMediaQuery";
import { useHoverText } from "lib/providers/hover";
import { truncate } from "lib/utils";
import { isUndefined } from "lodash";

import { AppLink } from "./AppLink";
import { Copier } from "./copy";
import { Tooltip } from "./Tooltip";

export type LinkType =
  | "block_height"
  | "code_id"
  | "evm_contract_address"
  | "evm_tx_hash"
  | "function_name"
  | "module_name"
  | "nft_collection"
  | "pool_id"
  | "proposal_id"
  | "task_id"
  | "tx_hash"
  | AddressReturnType;

type TextFormat = "ellipsis" | "normal" | "truncate";

type CommonExplorerLinkProps = FlexProps & {
  ampCopierSection?: string;
  chainId?: string;
  copyValue?: string;
  externalLink?: string;
  fixedHeight?: boolean;
  isReadOnly?: boolean;
  leftIcon?: ReactNode;
  openNewTab?: boolean;
  queryParams?: Record<string, string>;
  rightIcon?: ReactNode;
  showCopyOnHover?: boolean;
  textFormat?: TextFormat;
  textLabel?: string;
  textVariant?: TextProps["variant"];
};

type ContractAddressExplorerLinkProps = CommonExplorerLinkProps & {
  textLabel: Option<string>;
  type: "evm_contract_address";
  value: string;
};

type FunctionNameExplorerLinkProps = CommonExplorerLinkProps & {
  queryParams: Record<string, string>;
  type: "function_name";
  value: Option<string>;
};

type DefaultExplorerLinkProps = CommonExplorerLinkProps & {
  type: Exclude<LinkType, "evm_contract_address" | "function_name">;
  value: string;
};

export type ExplorerLinkProps =
  | ContractAddressExplorerLinkProps
  | DefaultExplorerLinkProps
  | FunctionNameExplorerLinkProps;

export const getNavigationUrl = ({
  type,
  value,
  wasmEnabled = false,
}: {
  type: ExplorerLinkProps["type"];
  value: Option<string>;
  wasmEnabled?: boolean;
}) => {
  let url = "";
  switch (type) {
    case "block_height":
      // no block info for Genesis height (0)
      if (value === "0") return "";
      url = "/blocks";
      break;
    case "code_id":
      url = "/codes";
      break;
    case "contract_address":
      url = wasmEnabled ? "/contracts" : "/accounts";
      break;
    case "evm_contract_address":
      url = "/evm-contracts";
      break;
    case "evm_tx_hash":
      url = "/evm-txs";
      break;
    case "function_name":
      url = "/interact";
      break;
    case "invalid_address":
      return "";
    case "module_name":
      url = "/modules";
      break;
    case "nft_collection":
      url = "/nft-collections";
      break;
    case "pool_id":
      url = "/pools";
      break;
    case "proposal_id":
      url = "/proposals";
      break;
    case "task_id":
      url = "/my-module-verifications";
      break;
    case "tx_hash":
      url = "/txs";
      break;
    case "user_address":
      url = "/accounts";
      break;
    case "validator_address":
      url = "/validators";
      break;
    default:
      break;
  }

  if (value) return `${url}/${value}`;

  return url;
};

const getValueText = (
  isOwnAddr: boolean,
  isTruncate: boolean,
  value: string
) => {
  if (isOwnAddr) {
    return "Me";
  }
  return isTruncate ? truncate(value) : value;
};

const getCopyLabel = (type: LinkType, value: string) => {
  if (type === "user_address") return "address";

  if (type === "nft_collection") {
    if (value.includes("/nft/")) {
      return "nft";
    }
  }

  return type
    .split("_")
    .map((str: string) => str.charAt(0) + str.slice(1))
    .join(" ");
};

const isTooltipHidden = (type: LinkType, textFormat: TextFormat) => {
  if (textFormat === "ellipsis" || textFormat === "normal") return true;

  if (
    type === "evm_contract_address" ||
    type === "evm_tx_hash" ||
    type === "tx_hash" ||
    type === "user_address" ||
    type === "contract_address" ||
    type === "validator_address"
  )
    return false;

  return true;
};

const LinkRender = ({
  chainId,
  fallbackValue,
  hrefLink,
  isEllipsis,
  isInternal,
  openNewTab,
  textLabel,
  textValue,
  textVariant,
  type,
}: {
  chainId?: string;
  fallbackValue: string;
  hrefLink: string;
  isEllipsis: boolean;
  isInternal: boolean;
  openNewTab: Option<boolean>;
  textLabel?: string;
  textValue: string;
  textVariant: TextProps["variant"];
  type: string;
}) => {
  const { currentChainId } = useCelatoneApp();
  const textElement = (
    <Text
      className={isEllipsis ? "ellipsis" : undefined}
      color={textValue.length ? "primary.main" : "text.disabled"}
      fontFamily="mono"
      isTruncated={!!textLabel}
      pointerEvents={hrefLink ? "auto" : "none"}
      variant={textVariant}
      wordBreak={{ base: "break-all", md: "inherit" }}
    >
      {textValue || fallbackValue}
    </Text>
  );

  return isInternal && !openNewTab ? (
    <AppLink
      style={{ overflow: "hidden" }}
      chainId={chainId}
      href={hrefLink}
      passHref
      onClick={(e) => e.stopPropagation()}
    >
      {textElement}
    </AppLink>
  ) : (
    <a
      style={{ overflow: "hidden" }}
      data-peer
      href={isInternal ? `/${chainId ?? currentChainId}${hrefLink}` : hrefLink}
      rel="noopener noreferrer"
      target="_blank"
      onClick={(e) => {
        if (!isInternal) trackMintScan(type);
        e.stopPropagation();
      }}
    >
      {textElement}
    </a>
  );
};

export const ExplorerLink = ({
  ampCopierSection,
  chainId,
  copyValue,
  externalLink,
  fixedHeight = true,
  isReadOnly = false,
  leftIcon = null,
  openNewTab,
  queryParams,
  rightIcon = null,
  showCopyOnHover = false,
  textFormat = "truncate",
  textLabel,
  textVariant = "body2",
  type,
  value = "",
  ...componentProps
}: ExplorerLinkProps) => {
  const isMobile = useMobile();
  const { chainConfigs } = useChainConfigs();
  const { address } = useCurrentChain();
  const { enabled: wasmEnabled } = useWasmConfig({ shouldRedirect: false });
  const { hoveredText, setHoveredText } = useHoverText();

  const [internalLink, textValue] = [
    getNavigationUrl({
      type,
      value,
      wasmEnabled,
    }),
    textLabel ??
      getValueText(value === address, textFormat === "truncate", value),
  ];

  const link = `${externalLink ?? internalLink}${
    queryParams && Object.keys(queryParams).length > 0
      ? `?${new URLSearchParams(queryParams).toString()}`
      : ""
  }`;
  const isNotInitiaChainId = chainId && !chainConfigs[chainId];
  const readOnly = isReadOnly || !link || isNotInitiaChainId;
  const isHighlighted = hoveredText === value;

  // TODO: handle auto width
  return readOnly ? (
    <Flex
      className="copier-wrapper"
      alignItems="center"
      gap={1}
      {...componentProps}
    >
      {leftIcon}
      <Text color="text.disabled" variant="body2">
        {textValue}
      </Text>
      {rightIcon}
      <Copier
        display={showCopyOnHover && !isMobile ? "none" : "inline"}
        hoverLabel={`Copy ${getCopyLabel(type, value)}`}
        ml={1}
        type={type}
        value={copyValue ?? value}
      />
    </Flex>
  ) : (
    <Flex
      className="copier-wrapper"
      align="center"
      borderColor="transparent"
      borderStyle="dashed"
      borderWidth="1px"
      display="inline-flex"
      h={fixedHeight ? "24px" : "auto"}
      maxW={textLabel ? "100%" : "fit-content"}
      px={1}
      rounded={4}
      sx={{
        ...(isHighlighted && {
          backgroundColor: transparentize("warning.dark", 0.3),
          borderColor: "warning.dark",
        }),
        "&:hover": {
          backgroundColor: transparentize("warning.dark", 0.3),
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        },
      }}
      transition="all 0.15s ease-in-out"
      w="fit-content"
      onMouseEnter={() => setHoveredText(textValue)}
      onMouseLeave={() => setHoveredText(null)}
      {...componentProps}
    >
      <Tooltip
        hidden={isTooltipHidden(type, textFormat)}
        label={value}
        textAlign="center"
      >
        {leftIcon}
        <LinkRender
          chainId={chainId}
          fallbackValue={copyValue ?? ""}
          hrefLink={link}
          isEllipsis={textFormat === "ellipsis"}
          isInternal={isUndefined(externalLink)}
          openNewTab={openNewTab}
          textLabel={textLabel}
          textValue={textValue}
          textVariant={textVariant}
          type={type}
        />
        {rightIcon}
      </Tooltip>
      <Copier
        amptrackSection={ampCopierSection}
        display={showCopyOnHover && !isMobile ? "none" : "inline"}
        hoverLabel={`Copy ${getCopyLabel(type, value)}`}
        ml={1}
        type={type}
        value={copyValue ?? value}
      />
    </Flex>
  );
};
