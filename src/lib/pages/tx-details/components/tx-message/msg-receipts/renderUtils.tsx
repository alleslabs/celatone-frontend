import { Text } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";

import type { LinkType } from "lib/components/ExplorerLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import type { AddressReturnType } from "lib/hooks";
import type { Addr, Option, TxReceipt, ValidatorAddr } from "lib/types";

interface CommonReceiptHtmlArgs {
  type: "json" | "explorer";
  value: Option<string>;
  linkType?: LinkType;
  fallback?: string;
}

// Util Functions
export const getCommonReceiptHtml = ({
  type,
  value,
  linkType = "invalid_address",
  fallback,
}: CommonReceiptHtmlArgs) => {
  if (!value)
    return (
      <Text variant="body2" color="text.dark">
        {fallback}
      </Text>
    );

  return type === "json" ? (
    <JsonReadOnly
      text={JSON.stringify(value, null, 2)}
      canViewFull
      disableResizing
      canCopy
      height="200px"
      width="full"
      margin={0}
    />
  ) : (
    <ExplorerLink
      type={linkType}
      value={value}
      canCopyWithHover
      textFormat="normal"
      maxWidth="full"
    />
  );
};

export const getGenericValueEntry = (
  entry: [string, string | object],
  getAddressType: (address: string) => AddressReturnType
): TxReceipt => {
  const [title, value] = entry;
  let valueObj: Omit<TxReceipt, "title">;
  switch (typeof value) {
    case "object":
      valueObj = {
        html: getCommonReceiptHtml({
          type: "json",
          value: JSON.stringify(value, null, 2),
        }),
      };
      break;
    case "string":
      if (getAddressType(value) !== "invalid_address")
        valueObj = {
          html: getCommonReceiptHtml({
            type: "explorer",
            value,
            linkType: getAddressType(value),
          }),
        };
      else valueObj = { value };
      break;
    default:
      valueObj = { value };
  }

  return { title, ...valueObj };
};

// Duplicated Components
// Coins component
export const attachFundsReceipt = (value: Option<Coin[]>): TxReceipt => ({
  title: "Attached Funds",
  html: value ? (
    JSON.stringify(value)
  ) : (
    <Text variant="body2" color="text.dark">
      No Attached Funds
    </Text>
  ),
});

export const delegatorAddrReceipt = (
  value: Addr,
  addrType: LinkType
): TxReceipt => ({
  title: "Delegator Address",
  html: getCommonReceiptHtml({
    type: "explorer",
    value,
    linkType: addrType,
  }),
});

export const validatorAddrReceipt = (value: ValidatorAddr): TxReceipt => ({
  title: "Validator Address",
  html: getCommonReceiptHtml({
    type: "explorer",
    value,
    linkType: "validator_address",
  }),
});

export const proposalIdReceipt = (value: string): TxReceipt => ({
  title: "Proposal ID",
  html: getCommonReceiptHtml({
    type: "explorer",
    value,
    linkType: "proposal_id",
  }),
});

export const clientStateReceipt = (value: string): TxReceipt => ({
  title: "Client State",
  html: getCommonReceiptHtml({ type: "json", value }),
});

export const proofInitReceipt = (value: string): TxReceipt => ({
  title: "Proof Init",
  value,
});

export const proofHeightReceipt = (value: string): TxReceipt => ({
  title: "Proof Height",
  html: getCommonReceiptHtml({ type: "json", value }),
});

export const channelIdReceipt = (value: string): TxReceipt => ({
  title: "Channel ID",
  value,
});
