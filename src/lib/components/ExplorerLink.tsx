import type { BoxProps, TextProps } from "@chakra-ui/react";
import { Box, Text, Flex } from "@chakra-ui/react";

import type { ExplorerConfig } from "config/chain/types";
import type { AddressReturnType } from "lib/app-provider";
import { useCelatoneApp } from "lib/app-provider/contexts";
import { useBaseApiRoute } from "lib/app-provider/hooks/useBaseApiRoute";
import { useCurrentChain } from "lib/app-provider/hooks/useCurrentChain";
import { useMobile } from "lib/app-provider/hooks/useMediaQuery";
import { AmpTrackMintscan } from "lib/services/amplitude";
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
  | "pool_id";

interface ExplorerLinkProps extends BoxProps {
  value: string;
  type: LinkType;
  copyValue?: string;
  showCopyOnHover?: boolean;
  isReadOnly?: boolean;
  textFormat?: "truncate" | "ellipsis" | "normal";
  maxWidth?: string;
  textVariant?: TextProps["variant"];
  ampCopierSection?: string;
  openNewTab?: boolean;
  fixedHeight?: boolean;
}

export const getNavigationUrl = (
  type: ExplorerLinkProps["type"],
  explorerConfig: ExplorerConfig,
  value: string,
  lcdEndpoint: string
) => {
  let url = "";
  switch (type) {
    case "tx_hash":
      url = "/txs";
      break;
    case "contract_address":
      url = "/contracts";
      break;
    case "user_address":
      url = "/accounts";
      break;
    case "validator_address":
      url =
        explorerConfig.validator ||
        `${lcdEndpoint}/cosmos/staking/v1beta1/validators`;
      break;
    case "code_id":
      url = "/codes";
      break;
    case "block_height":
      url = "/blocks";
      break;
    case "proposal_id":
      url =
        explorerConfig.proposal ||
        `${lcdEndpoint}/cosmos/gov/v1beta1/proposals`;
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
  maxWidth,
  textVariant,
  openNewTab,
}: {
  type: string;
  isInternal: boolean;
  hrefLink: string;
  textValue: string;
  isEllipsis: boolean;
  maxWidth: ExplorerLinkProps["maxWidth"];
  textVariant: TextProps["variant"];
  openNewTab: Option<boolean>;
}) => {
  const { currentChainId } = useCelatoneApp();
  const textElement = (
    <Text
      variant={textVariant}
      color="secondary.main"
      transition="all .25s ease-in-out"
      _hover={{ color: "secondary.light" }}
      className={isEllipsis ? "ellipsis" : undefined}
      maxW={maxWidth}
      pointerEvents={hrefLink ? "auto" : "none"}
      wordBreak={{ base: "break-all", md: "inherit" }}
      display={{ base: "inline", md: "flex" }}
    >
      {textValue}
    </Text>
  );

  return isInternal && !openNewTab ? (
    <AppLink href={hrefLink} passHref onClick={(e) => e.stopPropagation()}>
      {textElement}
    </AppLink>
  ) : (
    <a
      href={isInternal ? `/${currentChainId}${hrefLink}` : hrefLink}
      target="_blank"
      rel="noopener noreferrer"
      data-peer
      onClick={(e) => {
        AmpTrackMintscan(type);
        e.stopPropagation();
      }}
    >
      {textElement}
    </a>
  );
};

export const ExplorerLink = ({
  value,
  type,
  copyValue,
  showCopyOnHover = false,
  isReadOnly = false,
  textFormat = "truncate",
  maxWidth = "160px",
  textVariant = "body2",
  ampCopierSection,
  openNewTab,
  fixedHeight = true,
  ...componentProps
}: ExplorerLinkProps) => {
  const { address } = useCurrentChain();
  const lcdEndpoint = useBaseApiRoute("rest");
  const {
    chainConfig: { explorerLink: explorerConfig },
  } = useCelatoneApp();

  const isInternal =
    type === "code_id" ||
    type === "contract_address" ||
    type === "user_address" ||
    type === "tx_hash" ||
    type === "block_height" ||
    type === "pool_id";

  const [hrefLink, textValue] = [
    getNavigationUrl(type, explorerConfig, copyValue || value, lcdEndpoint),
    getValueText(value === address, textFormat === "truncate", value),
  ];

  const readOnly = isReadOnly || !hrefLink;
  const isMobile = useMobile();
  return (
    <Box
      className="copier-wrapper"
      display="inline-flex"
      alignItems="center"
      transition="all .25s ease-in-out"
      _hover={{
        ...(!readOnly && {
          textDecoration: "underline",
          textDecorationColor: "secondary.light",
        }),
      }}
      {...componentProps}
    >
      {readOnly ? (
        <Text variant="body2" color="text.disabled">
          {textValue}
        </Text>
      ) : (
        <Flex
          display={{ base: "inline-flex", md: "flex" }}
          align="center"
          h={fixedHeight ? "24px" : "auto"}
        >
          <LinkRender
            type={type}
            isInternal={isInternal}
            hrefLink={hrefLink}
            textValue={textValue}
            isEllipsis={textFormat === "ellipsis"}
            maxWidth={maxWidth}
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
      )}
    </Box>
  );
};
