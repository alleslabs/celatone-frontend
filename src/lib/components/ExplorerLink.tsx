import type { BoxProps } from "@chakra-ui/react";
import { Box, Link } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import {
  getExplorerContractAddressUrl,
  getExplorerTxUrl,
  getExplorerUserAddressUrl,
} from "lib/data";
import { truncate } from "lib/utils";

import { Copier } from "./copier";

interface ExplorerLinkProps extends BoxProps {
  value: string;
  type?: "tx_hash" | "contract_address" | "user_address";
  hover?: boolean;
  copy?: string;
  isTruncate?: boolean;
  isReadOnly?: boolean;
}

export const ExplorerLink = ({
  value,
  type,
  copy,
  hover = false,
  isReadOnly = false,
  isTruncate = true,
  ...componentProps
}: ExplorerLinkProps) => {
  const { currentChainName } = useWallet();
  let explorerLink = "";
  switch (type) {
    case "tx_hash":
      explorerLink = getExplorerTxUrl(currentChainName);
      break;
    case "contract_address":
      explorerLink = getExplorerContractAddressUrl(currentChainName);
      break;
    case "user_address":
      explorerLink = getExplorerUserAddressUrl(currentChainName);
      break;
    default:
      break;
  }

  const hrefLink = () => {
    if (explorerLink) {
      if (copy) {
        return `${explorerLink}/${copy}`;
      }
      return `${explorerLink}/${value}`;
    }
    return undefined;
  };
  return (
    <Box
      role="group"
      display="inline-flex"
      alignItems="center"
      pointerEvents={isReadOnly ? "none" : "auto"}
      {...componentProps}
    >
      <Link
        href={hrefLink()}
        target="_blank"
        rel="noopener noreferrer"
        color="primary.main"
        data-peer
        onClick={(e) => e.stopPropagation()}
      >
        {isTruncate ? truncate(value) : value}
      </Link>
      <Box
        alignItems="center"
        display={hover ? "none" : undefined}
        _groupHover={hover ? { display: "flex" } : undefined}
      >
        <Copier value={copy || value} ml="8px" />
      </Box>
    </Box>
  );
};
