import type { BoxProps } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import {
  getExplorerBlockUrl,
  getExplorerTxUrl,
  getProposalUrl,
} from "lib/app-fns/explorer";
import type { AddressReturnType } from "lib/app-provider";
import { AmpTrackMintscan } from "lib/services/amplitude";
import { truncate } from "lib/utils";

import { AppLink } from "./AppLink";
import { Copier } from "./Copier";

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
}

const getNavigationUrl = (
  type: ExplorerLinkProps["type"],
  currentChainName: string,
  value: string
) => {
  let url = "";
  switch (type) {
    case "tx_hash":
      url = getExplorerTxUrl(currentChainName);
      break;
    case "contract_address":
      url = "/contract";
      break;
    case "user_address":
      url = "/account";
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
}: {
  type: string;
  isInternal: boolean;
  hrefLink: string;
  textValue: string;
  isEllipsis: boolean;
  maxWidth: ExplorerLinkProps["maxWidth"];
}) => {
  const textElement = (
    <Text
      variant="body2"
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
  maxWidth = "150px",
  ...componentProps
}: ExplorerLinkProps) => {
  const { address, currentChainName } = useWallet();
  const isInternal =
    type === "code_id" ||
    type === "contract_address" ||
    type === "user_address";

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
