import type { BoxProps, TextProps } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import {
  getExplorerBlockUrl,
  getProposalUrl,
  getExplorerValidatorUrl,
} from "lib/app-fns/explorer";
import type { AddressReturnType } from "lib/hooks";
import { AmpTrackMintscan } from "lib/services/amplitude";
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
  canCopyWithHover?: boolean;
  isReadOnly?: boolean;
  textFormat?: "truncate" | "ellipsis" | "normal";
  maxWidth?: string;
  textVariant?: TextProps["variant"];
}

const getNavigationUrl = (
  type: ExplorerLinkProps["type"],
  currentChainName: string,
  value: string
) => {
  let url = "";
  switch (type) {
    case "tx_hash":
      url = "/tx";
      break;
    case "contract_address":
      url = "/contract";
      break;
    case "user_address":
      url = "/account";
      break;
    case "validator_address":
      url = getExplorerValidatorUrl(currentChainName);
      break;
    case "code_id":
      url = "/code";
      break;
    case "block_height":
      url = getExplorerBlockUrl(currentChainName);
      break;
    case "proposal_id":
      url = getProposalUrl(currentChainName);
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

const LinkRender = ({
  type,
  isInternal,
  hrefLink,
  textValue,
  isEllipsis,
  maxWidth,
  textVariant,
}: {
  type: string;
  isInternal: boolean;
  hrefLink: string;
  textValue: string;
  isEllipsis: boolean;
  maxWidth: ExplorerLinkProps["maxWidth"];
  textVariant: TextProps["variant"];
}) => {
  const textElement = (
    <Text
      variant={textVariant}
      color="lilac.main"
      transition="all .25s ease-in-out"
      _hover={{ color: "lilac.light" }}
      className={isEllipsis ? "ellipsis" : undefined}
      maxW={maxWidth}
      pointerEvents={hrefLink ? "auto" : "none"}
    >
      {textValue}
    </Text>
  );

  return isInternal ? (
    <AppLink href={hrefLink} passHref onClick={(e) => e.stopPropagation()}>
      {textElement}
    </AppLink>
  ) : (
    <a
      href={hrefLink}
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
  canCopyWithHover = false,
  isReadOnly = false,
  textFormat = "truncate",
  maxWidth = "160px",
  textVariant = "body2",
  ...componentProps
}: ExplorerLinkProps) => {
  const { address, currentChainName } = useWallet();
  const isInternal =
    type === "code_id" ||
    type === "contract_address" ||
    type === "user_address" ||
    type === "tx_hash";

  const [hrefLink, textValue] = [
    getNavigationUrl(type, currentChainName, copyValue || value),
    getValueText(value === address, textFormat === "truncate", value),
  ];

  const readOnly = isReadOnly || !hrefLink;

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      transition="all .25s ease-in-out"
      _hover={{
        ...(!readOnly && {
          textDecoration: "underline",
          textDecorationColor: "lilac.light",
        }),
        "& .copy-button": {
          display: "flex",
        },
      }}
      {...componentProps}
    >
      {readOnly ? (
        <Text variant="body2">{textValue}</Text>
      ) : (
        <>
          <LinkRender
            type={type}
            isInternal={isInternal}
            hrefLink={hrefLink}
            textValue={textValue}
            isEllipsis={textFormat === "ellipsis"}
            maxWidth={maxWidth}
            textVariant={textVariant}
          />
          <Copier
            value={copyValue || value}
            ml="8px"
            className="copy-button"
            display={canCopyWithHover ? "none" : "flex"}
          />
        </>
      )}
    </Box>
  );
};
