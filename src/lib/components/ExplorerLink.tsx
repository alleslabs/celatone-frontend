import type { FlexProps, TextProps } from "@chakra-ui/react";
import type { Option } from "lib/types";
import type { ReactNode } from "react";

import { Box, Flex, Text } from "@chakra-ui/react";
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
  | "move_dex_pool_address"
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
  hideCopy?: boolean;
  isReadOnly?: boolean;
  leftIcon?: ReactNode;
  openNewTab?: boolean;
  queryParams?: Record<string, string>;
  rightIcon?: ReactNode;
  showCopyOnHover?: boolean;
  textFormat?: TextFormat;
  textLabel?: string;
  textVariant?: TextProps["variant"];
  tooltipLabel?: string;
};

type FunctionNameExplorerLinkProps = CommonExplorerLinkProps & {
  queryParams: Record<string, string>;
  type: "function_name";
  value: Option<string>;
};

type DefaultExplorerLinkProps = CommonExplorerLinkProps & {
  type: Exclude<LinkType, "function_name">;
  value: string;
};

export type ExplorerLinkProps =
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

  if (value) {
    const safe = value
      .split("/")
      .map((seg) => encodeURIComponent(seg))
      .join("/");
    return `${url}/${safe}`;
  }

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
  // Always show tooltip for ellipsis format to show full text
  if (textFormat === "ellipsis") return false;

  // Hide tooltip for normal format since text is not truncated
  if (textFormat === "normal") return true;

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
  textFormat,
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
  textFormat: TextFormat;
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
      isTruncated={textFormat === "truncate"}
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
  fixedHeight = false,
  hideCopy = false,
  isReadOnly = false,
  isTruncated,
  leftIcon = null,
  openNewTab,
  queryParams,
  rightIcon = null,
  showCopyOnHover = false,
  textFormat = "truncate",
  textLabel,
  textVariant = "body2",
  tooltipLabel,
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
      {!hideCopy && (
        <Copier
          display={showCopyOnHover && !isMobile ? "none" : "inline"}
          hoverLabel={`Copy ${getCopyLabel(type, value)}`}
          ml={1}
          type={type}
          value={copyValue ?? value}
        />
      )}
    </Flex>
  ) : (
    <Flex
      className="copier-wrapper"
      align="center"
      borderColor="transparent"
      borderStyle="dashed"
      borderWidth="1px"
      display="inline-flex"
      gap={1}
      h={fixedHeight && textFormat !== "normal" ? "24px" : "auto"}
      maxW={textLabel ? "100%" : "fit-content"}
      maxWidth="full"
      position="relative"
      rounded={4}
      sx={{
        "&::before": {
          backgroundColor: isHighlighted
            ? transparentize("warning.dark", 0.3)
            : "transparent",
          border: isHighlighted ? "1px dashed" : "1px dashed transparent",
          borderColor: isHighlighted ? "warning.dark" : "transparent",
          borderRadius: "4px",
          bottom: "-2px",
          content: '""',
          left: "-4px",
          position: "absolute",
          right: "-4px",
          top: "-2px",
          transition: "all 0.15s ease-in-out",
          zIndex: 1,
        },

        "&:hover": {
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        },

        "&:hover::before": {
          backgroundColor: transparentize("warning.dark", 0.3),
          borderColor: "warning.dark",
        },

        "& > *": {
          position: "relative",
          zIndex: 2,
        },
      }}
      transition="all 0.15s ease-in-out"
      w="fit-content"
      onMouseEnter={() => setHoveredText(value)}
      onMouseLeave={() => setHoveredText(null)}
      onTouchEnd={() => setHoveredText(null)}
      onTouchStart={() => setHoveredText(value)}
      {...componentProps}
    >
      {leftIcon}
      <Box flex="1" isTruncated={isTruncated} minW={0}>
        {isMobile ? (
          <LinkRender
            chainId={chainId}
            fallbackValue={copyValue ?? ""}
            hrefLink={link}
            isEllipsis={textFormat === "ellipsis"}
            isInternal={isUndefined(externalLink)}
            openNewTab={openNewTab}
            textFormat={textFormat}
            textValue={textValue}
            textVariant={textVariant}
            type={type}
          />
        ) : (
          <Tooltip
            hidden={isTooltipHidden(type, textFormat)}
            label={tooltipLabel ?? value}
            textAlign="center"
          >
            <LinkRender
              chainId={chainId}
              fallbackValue={copyValue ?? ""}
              hrefLink={link}
              isEllipsis={textFormat === "ellipsis"}
              isInternal={isUndefined(externalLink)}
              openNewTab={openNewTab}
              textFormat={textFormat}
              textValue={textValue}
              textVariant={textVariant}
              type={type}
            />
          </Tooltip>
        )}
      </Box>
      {rightIcon}
      {!hideCopy && (
        <Copier
          amptrackSection={ampCopierSection}
          display={showCopyOnHover && !isMobile ? "none" : "inline"}
          hoverLabel={`Copy ${getCopyLabel(type, value)}`}
          ml={1}
          type={type}
          value={copyValue ?? value}
        />
      )}
    </Flex>
  );
};
