import type { FlexProps, TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import { isUndefined } from "lodash";
import type { ReactNode } from "react";

import { trackMintScan } from "lib/amplitude";
import type { AddressReturnType } from "lib/app-provider";
import { useCelatoneApp } from "lib/app-provider/contexts";
import { useWasmConfig } from "lib/app-provider/hooks/useConfig";
import { useCurrentChain } from "lib/app-provider/hooks/useCurrentChain";
import { useMobile } from "lib/app-provider/hooks/useMediaQuery";
import type { Option } from "lib/types";
import { truncate } from "lib/utils";

import { AppLink } from "./AppLink";
import { Copier } from "./copy";

export type LinkType =
  | "block_height"
  | "code_id"
  | "evm_contract_address"
  | "evm_tx_hash"
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
      variant={textVariant}
      color={textValue.length ? "primary.main" : "text.disabled"}
      fontFamily="mono"
      pointerEvents={hrefLink ? "auto" : "none"}
      wordBreak={{ base: "break-all", md: "inherit" }}
    >
      {textValue || fallbackValue}
    </Text>
  );

  return isInternal && !openNewTab ? (
    <AppLink
      style={{ overflow: "hidden" }}
      onClick={(e) => e.stopPropagation()}
      href={hrefLink}
      passHref
    >
      {textElement}
    </AppLink>
  ) : (
    <a
      style={{ overflow: "hidden" }}
      data-peer
      rel="noopener noreferrer"
      target="_blank"
      onClick={(e) => {
        if (!isInternal) trackMintScan(type);
        e.stopPropagation();
      }}
      href={isInternal ? `/${currentChainId}${hrefLink}` : hrefLink}
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
    getValueText(value === address, textFormat === "truncate", value),
  ];

  const link = externalLink ?? internalLink;
  const readOnly = isReadOnly || !link;
  // TODO: handle auto width
  return readOnly ? (
    <Flex alignItems="center" gap={1} {...componentProps}>
      <Text variant="body2" color="text.disabled">
        {textValue}
      </Text>
      {rightIcon}
    </Flex>
  ) : (
    <Flex
      className="copier-wrapper"
      align="center"
      display="inline-flex"
      gap={1}
      h={fixedHeight ? "24px" : "auto"}
      _hover={{
        textDecoration: "underline",
        textDecorationColor: "primary.light",
      }}
      transition="all 0.25s ease-in-out"
      {...componentProps}
    >
      <LinkRender
        fallbackValue={copyValue || value}
        isEllipsis={textFormat === "ellipsis"}
        isInternal={isUndefined(externalLink)}
        textValue={textValue}
        textVariant={textVariant}
        type={type}
        openNewTab={openNewTab}
        hrefLink={link}
      />
      {rightIcon}
      <Copier
        display={showCopyOnHover && !isMobile ? "none" : "inline"}
        ml={1}
        type={type}
        value={copyValue || value}
        amptrackSection={ampCopierSection}
        copyLabel={copyValue ? `${getCopyLabel(type)} Copied!` : undefined}
      />
    </Flex>
  );
};
