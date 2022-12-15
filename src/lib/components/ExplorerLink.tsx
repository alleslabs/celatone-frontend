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
  canCopyWithHover?: boolean;
  copyValue?: string;
  isTruncate?: boolean;
}

export const ExplorerLink = ({
  value,
  type,
  copyValue,
  canCopyWithHover = false,
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
    // copyValue is used in case where the value displayed is not the same as the copy value
    if (explorerLink) {
      if (copyValue) {
        return `${explorerLink}/${copyValue}`;
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
      {...componentProps}
    >
      <Link
        href={hrefLink()}
        target="_blank"
        rel="noopener noreferrer"
        color="primary.main"
        data-peer
        onClick={(e) => e.stopPropagation()}
        pointerEvents={!hrefLink() ? "none" : "auto"}
      >
        {isTruncate ? truncate(value) : value}
      </Link>
      <Box
        alignItems="center"
        display={canCopyWithHover ? "none" : undefined}
        _groupHover={canCopyWithHover ? { display: "flex" } : undefined}
      >
        <Copier value={copyValue || value} ml="8px" />
      </Box>
    </Box>
  );
};
