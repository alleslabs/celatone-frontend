import { Text } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";

import type { AddressReturnType } from "lib/app-provider";
import type { LinkType } from "lib/components/ExplorerLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import type {
  Addr,
  AssetInfo,
  Option,
  TxReceipt,
  ValidatorAddr,
} from "lib/types";
import { convertToTitle } from "lib/utils";

import { CoinComponent } from "./CoinComponent";

type HtmlType = "json" | "explorer";

interface CommonReceiptHtmlArgs<T extends HtmlType, V> {
  type: T;
  value: Option<V> | null;
  linkType?: LinkType;
  fallback?: string;
}

// Util Functions
export const getCommonReceiptHtml = <T extends HtmlType>({
  type,
  value,
  linkType = "invalid_address",
  fallback = "N/A",
}: CommonReceiptHtmlArgs<T, T extends "json" ? object : string>) => {
  if (value === undefined)
    return (
      <Text variant="body2" color="warning.dark">
        Data not found
      </Text>
    );

  if (!value)
    return (
      <Text variant="body2" color={value === null ? "pebble.600" : "text.dark"}>
        {value === null ? String(value) : fallback}
      </Text>
    );

  // TODO: Find a solution, TS doesn't know that type === "json" would make typeof value === "object"
  return type === "json" || typeof value === "object" ? (
    <JsonReadOnly
      text={JSON.stringify(value, null, 2)}
      canCopy
      fullWidth
      isExpandable
    />
  ) : (
    <ExplorerLink
      type={linkType}
      value={value}
      showCopyOnHover
      textFormat="normal"
      maxWidth="full"
    />
  );
};

export const getCoinComponent = (
  amount: Coin | Coin[],
  assetInfos: Option<{ [key: string]: AssetInfo }>
) => <CoinComponent amount={amount} assetInfos={assetInfos} />;

export const getGenericValueEntry = (
  [title, value]: [string, string | object],
  getAddressType: (address: string) => AddressReturnType
): TxReceipt => {
  let valueObj: Omit<TxReceipt, "title">;
  switch (typeof value) {
    case "object":
      valueObj = {
        html: getCommonReceiptHtml({
          type: "json",
          value,
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

  return { title: convertToTitle(title), ...valueObj };
};

export const attachFundsReceipt = (
  value: Option<Coin[]>,
  assetInfos: Option<{ [key: string]: AssetInfo }>
): TxReceipt => ({
  title: "Attached Funds",
  html: value?.length ? (
    getCoinComponent(value, assetInfos)
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

export const proposalIdReceipt = (value: Option<string>): TxReceipt => ({
  title: "Proposal ID",
  html: getCommonReceiptHtml({
    type: "explorer",
    value,
    linkType: "proposal_id",
  }),
});

export const clientStateReceipt = (value: object): TxReceipt => ({
  title: "Client State",
  html: getCommonReceiptHtml({ type: "json", value }),
});

export const proofInitReceipt = (value: string): TxReceipt => ({
  title: "Proof Init",
  value,
});

export const proofHeightReceipt = (value: object): TxReceipt => ({
  title: "Proof Height",
  html: getCommonReceiptHtml({ type: "json", value }),
});

export const channelIdReceipt = (value: string): TxReceipt => ({
  title: "Channel ID",
  value,
});
