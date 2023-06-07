import type { BoxProps, TextProps } from "@chakra-ui/react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import {
  getExplorerProposalUrl,
  getExplorerValidatorUrl,
} from "lib/app-fns/explorer";
import type { AddressReturnType } from "lib/app-provider";
import { useCurrentNetwork } from "lib/app-provider/hooks/useCurrentNetwork";
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
  | "proposal_id";

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
}

const getNavigationUrl = (
  type: ExplorerLinkProps["type"],
  currentChainName: string,
  value: string
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
      url = getExplorerValidatorUrl(currentChainName);
      break;
    case "code_id":
      url = "/codes";
      break;
    case "block_height":
      url = "/blocks";
      break;
    case "proposal_id":
      url = getExplorerProposalUrl(currentChainName);
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
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
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
  const { network } = useCurrentNetwork();
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
      align={{ base: "start", md: "center" }}
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
      href={isInternal ? `/${network}${hrefLink}` : hrefLink}
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
  ...componentProps
}: ExplorerLinkProps) => {
  const { address, currentChainName } = useWallet();
  const isInternal =
    type === "code_id" ||
    type === "contract_address" ||
    type === "user_address" ||
    type === "tx_hash" ||
    type === "block_height";

  const [hrefLink, textValue] = [
    getNavigationUrl(type, currentChainName, copyValue || value),
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
        <Text variant="body2">{textValue}</Text>
      ) : (
        <Flex
          display={{ base: "inline-flex", md: "flex" }}
          align="center"
          h="24px"
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
