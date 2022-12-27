import type { BoxProps } from "@chakra-ui/react";
import { Box, Link, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import {
  getExplorerContractAddressUrl,
  getExplorerTxUrl,
  getExplorerUserAddressUrl,
} from "lib/data";
import { truncate } from "lib/utils";

import { Copier } from "./Copier";

interface ExplorerLinkProps extends BoxProps {
  value: string;
  type?: "tx_hash" | "contract_address" | "user_address";
  copyValue?: string;
  canCopyWithHover?: boolean;
  isReadOnly?: boolean;
  textFormat?: "truncate" | "ellipsis" | "normal";
  maxWidth?: string;
}

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

  /**
   * @remarks
   * The `copyValue` is used in case where the value displayed is not the same as the copy value
   */
  const hrefLink = () => {
    if (explorerLink) {
      if (copyValue) {
        return `${explorerLink}/${copyValue}`;
      }
      return `${explorerLink}/${value}`;
    }
    return undefined;
  };

  const renderValue = () => {
    if (value === address) {
      return "Me";
    }
    if (textFormat === "truncate") {
      return truncate(value);
    }
    return value;
  };

  return (
    <Box
      role="group"
      display="inline-flex"
      alignItems="center"
      {...componentProps}
    >
      {isReadOnly ? (
        <Text variant="body2">{renderValue()}</Text>
      ) : (
        <>
          <Link
            fontWeight="400"
            href={hrefLink()}
            target="_blank"
            rel="noopener noreferrer"
            color="primary.main"
            data-peer
            onClick={(e) => e.stopPropagation()}
            pointerEvents={!hrefLink() ? "none" : "auto"}
            className={textFormat === "ellipsis" ? "ellipsis" : undefined}
            maxW={maxWidth}
          >
            {renderValue()}
          </Link>
          <Box
            alignItems="center"
            display={canCopyWithHover ? "none" : undefined}
            _groupHover={canCopyWithHover ? { display: "flex" } : undefined}
          >
            <Copier value={copyValue || value} ml="8px" />
          </Box>
        </>
      )}
    </Box>
  );
};
