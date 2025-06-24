import type { FlexProps, TextProps } from "@chakra-ui/react";
import type { AddressReturnType } from "lib/app-provider";
import type { Option } from "lib/types";
import type { ReactNode } from "react";

import { Flex, Text } from "@chakra-ui/react";
import { trackMintScan } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider/contexts";
import { useWasmConfig } from "lib/app-provider/hooks/useConfig";
import { useCurrentChain } from "lib/app-provider/hooks/useCurrentChain";
import { useMobile } from "lib/app-provider/hooks/useMediaQuery";
import { truncate } from "lib/utils";
import { isUndefined } from "lodash";

import { AppLink } from "./AppLink";
import { Copier } from "./copy";

export type LinkType =
  | "block_height"
  | "code_id"
  | "evm_contract_address"
  | "evm_tx_hash"
  | "module_name"
  | "pool_id"
  | "proposal_id"
  | "task_id"
  | "tx_hash"
  | AddressReturnType;

interface ExplorerLinkProps extends FlexProps {
  ampCopierSection?: string;
  copyValue?: string;
  externalLink?: string;
  fixedHeight?: boolean;
  isReadOnly?: boolean;
  openNewTab?: boolean;
  rightIcon?: ReactNode;
  showCopyOnHover?: boolean;
  textFormat?: "ellipsis" | "normal" | "truncate";
  textLabel?: string;
  textVariant?: TextProps["variant"];
  type: LinkType;
  value: string;
}

export const getNavigationUrl = ({
  type,
  value,
  wasmEnabled = false,
}: {
  type: ExplorerLinkProps["type"];
  value: string;
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
    case "invalid_address":
      return "";
    case "module_name":
      url = "/modules";
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
  return `${url}/${value}`;
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

const getCopyLabel = (type: LinkType) =>
  type
    .split("_")
    .map((str: string) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");

const LinkRender = ({
  fallbackValue,
  hrefLink,
  isEllipsis,
  isInternal,
  openNewTab,
  textValue,
  textVariant,
  type,
}: {
  fallbackValue: string;
  hrefLink: string;
  isEllipsis: boolean;
  isInternal: boolean;
  openNewTab: Option<boolean>;
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
      href={isInternal ? `/${currentChainId}${hrefLink}` : hrefLink}
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
  copyValue,
  externalLink,
  fixedHeight = true,
  isReadOnly = false,
  openNewTab,
  rightIcon = null,
  showCopyOnHover = false,
  textFormat = "truncate",
  textLabel,
  textVariant = "body2",
  type,
  value,
  ...componentProps
}: ExplorerLinkProps) => {
  const isMobile = useMobile();
  const { address } = useCurrentChain();
  const { enabled: wasmEnabled } = useWasmConfig({ shouldRedirect: false });

  const [internalLink, textValue] = [
    getNavigationUrl({
      type,
      value: copyValue || value,
      wasmEnabled,
    }),
    textLabel ??
      getValueText(value === address, textFormat === "truncate", value),
  ];

  const link = externalLink ?? internalLink;
  const readOnly = isReadOnly || !link;
  // TODO: handle auto width
  return readOnly ? (
    <Flex alignItems="center" gap={1} {...componentProps}>
      <Text color="text.disabled" variant="body2">
        {textValue}
      </Text>
      {rightIcon}
    </Flex>
  ) : (
    <Flex
      className="copier-wrapper"
      _hover={{
        textDecoration: "underline",
        textDecorationColor: "primary.light",
      }}
      align="center"
      display="inline-flex"
      gap={1}
      h={fixedHeight ? "24px" : "auto"}
      transition="all 0.25s ease-in-out"
      {...componentProps}
    >
      <LinkRender
        fallbackValue={copyValue || value}
        hrefLink={link}
        isEllipsis={textFormat === "ellipsis"}
        isInternal={isUndefined(externalLink)}
        openNewTab={openNewTab}
        textValue={textValue}
        textVariant={textVariant}
        type={type}
      />
      {rightIcon}
      <Copier
        amptrackSection={ampCopierSection}
        copyLabel={copyValue ? `${getCopyLabel(type)} Copied!` : undefined}
        display={showCopyOnHover && !isMobile ? "none" : "inline"}
        ml={1}
        type={type}
        value={copyValue || value}
      />
    </Flex>
  );
};
