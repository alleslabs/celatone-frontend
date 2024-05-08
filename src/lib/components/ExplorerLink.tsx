import type { FlexProps, TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import { isUndefined } from "lodash";

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
  | AddressReturnType
  | "tx_hash"
  | "code_id"
  | "block_height"
  | "proposal_id"
  | "pool_id"
  | "proposal_id";

interface ExplorerLinkProps extends FlexProps {
  value: string;
  type: LinkType;
  copyValue?: string;
  externalLink?: string;
  showCopyOnHover?: boolean;
  isReadOnly?: boolean;
  textFormat?: "truncate" | "ellipsis" | "normal";
  textVariant?: TextProps["variant"];
  ampCopierSection?: string;
  openNewTab?: boolean;
  fixedHeight?: boolean;
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
    case "tx_hash":
      url = "/txs";
      break;
    case "contract_address":
      url = wasmEnabled ? "/contracts" : "/accounts";
      break;
    case "user_address":
      url = "/accounts";
      break;
    case "validator_address":
      url = "/validators";
      break;
    case "code_id":
      url = "/codes";
      break;
    case "block_height":
      // no block info for Genesis height (0)
      if (value === "0") return "";
      url = "/blocks";
      break;
    case "proposal_id":
      url = "/proposals";
      break;
    case "pool_id":
      url = "/pools";
      break;
    case "invalid_address":
      return "";
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
  type,
  isInternal,
  hrefLink,
  textValue,
  isEllipsis,
  textVariant,
  openNewTab,
}: {
  type: string;
  isInternal: boolean;
  hrefLink: string;
  textValue: string;
  isEllipsis: boolean;
  textVariant: TextProps["variant"];
  openNewTab: Option<boolean>;
}) => {
  const { currentChainId } = useCelatoneApp();
  const textElement = (
    <Text
      variant={textVariant}
      fontFamily="mono"
      color="secondary.main"
      className={isEllipsis ? "ellipsis" : undefined}
      pointerEvents={hrefLink ? "auto" : "none"}
      wordBreak={{ base: "break-all", md: "inherit" }}
    >
      {textValue}
    </Text>
  );

  return isInternal && !openNewTab ? (
    <AppLink
      href={hrefLink}
      passHref
      onClick={(e) => e.stopPropagation()}
      style={{ overflow: "hidden" }}
    >
      {textElement}
    </AppLink>
  ) : (
    <a
      href={isInternal ? `/${currentChainId}${hrefLink}` : hrefLink}
      target="_blank"
      rel="noopener noreferrer"
      data-peer
      onClick={(e) => {
        if (!isInternal) trackMintScan(type);
        e.stopPropagation();
      }}
      style={{ overflow: "hidden" }}
    >
      {textElement}
    </a>
  );
};

export const ExplorerLink = ({
  type,
  value,
  copyValue,
  externalLink,
  showCopyOnHover = false,
  isReadOnly = false,
  textFormat = "truncate",
  textVariant = "body2",
  ampCopierSection,
  openNewTab,
  fixedHeight = true,
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
    <Flex alignItems="center" {...componentProps}>
      <Text variant="body2" color="text.disabled">
        {textValue}
      </Text>
    </Flex>
  ) : (
    <Flex
      className="copier-wrapper"
      display="inline-flex"
      align="center"
      h={fixedHeight ? "24px" : "auto"}
      transition="all 0.25s ease-in-out"
      _hover={{
        textDecoration: "underline",
        textDecorationColor: "secondary.light",
      }}
      {...componentProps}
    >
      <LinkRender
        type={type}
        isInternal={isUndefined(externalLink)}
        hrefLink={link}
        textValue={textValue}
        isEllipsis={textFormat === "ellipsis"}
        textVariant={textVariant}
        openNewTab={openNewTab}
      />
      <Copier
        type={type}
        value={copyValue || value}
        copyLabel={copyValue ? `${getCopyLabel(type)} Copied!` : undefined}
        display={showCopyOnHover && !isMobile ? "none" : "inline"}
        ml={2}
        amptrackSection={ampCopierSection}
      />
    </Flex>
  );
};
