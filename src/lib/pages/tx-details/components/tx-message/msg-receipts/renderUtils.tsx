import { Text } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";

import type { AddressReturnType } from "lib/app-provider";
import type { LinkType } from "lib/components/ExplorerLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import type {
  BechAddr,
  Nullable,
  Option,
  TxReceipt,
  ValidatorAddr,
} from "lib/types";
import { convertToTitle } from "lib/utils";

import { CoinsComponent } from "./CoinsComponent";

interface CommonReceiptHtmlArgs<T extends HtmlType, V> {
  fallback?: string;
  linkType?: LinkType;
  type: T;
  value: Option<Nullable<V>>;
}

type HtmlType = "explorer" | "json";

// Util Functions
export const getCommonReceiptHtml = <T extends HtmlType>({
  fallback,
  linkType = "invalid_address",
  type,
  value,
}: CommonReceiptHtmlArgs<T, T extends "json" ? object : string>) => {
  switch (true) {
    case value === null:
      return (
        <Text variant="body2" color="gray.600">
          null
        </Text>
      );
    case Boolean(!value && fallback):
      return (
        <Text variant="body2" color="text.dark">
          {fallback}
        </Text>
      );
    case !value:
      return (
        <Text variant="body2" color="warning.dark">
          Data not found
        </Text>
      );
    // TODO: Find a solution, TS doesn't know that type === "json" would make typeof value === "object"
    case type === "json" || typeof value === "object":
      return (
        <JsonReadOnly
          fullWidth
          isExpandable
          text={JSON.stringify(value, null, 2)}
          amptrackSection="tx_page_msg_receipts"
          canCopy
        />
      );
    default:
      return (
        <ExplorerLink
          maxWidth="full"
          type={linkType}
          value={value as string}
          ampCopierSection="tx_msg_receipts"
          showCopyOnHover
          textFormat="normal"
          wordBreak="break-word"
        />
      );
  }
};

export const getGenericValueEntry = (
  [title, value]: [string, object | string],
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
            linkType: getAddressType(value),
            type: "explorer",
            value,
          }),
        };
      else valueObj = { value };
      break;
    default:
      valueObj = { value };
  }

  return { title: convertToTitle(title), ...valueObj };
};

export const attachFundsReceipt = (value: Option<Coin[]>): TxReceipt => ({
  html: value?.length ? (
    <CoinsComponent coins={value} />
  ) : (
    <Text variant="body2" color="text.dark">
      No Attached Funds
    </Text>
  ),
  title: "Attached Funds",
});

export const delegatorAddrReceipt = (
  value: BechAddr,
  addrType: LinkType
): TxReceipt => ({
  html: getCommonReceiptHtml({
    linkType: addrType,
    type: "explorer",
    value,
  }),
  title: "Delegator Address",
});

export const validatorAddrReceipt = (value: ValidatorAddr): TxReceipt => ({
  html: getCommonReceiptHtml({
    linkType: "validator_address",
    type: "explorer",
    value,
  }),
  title: "Validator Address",
});

export const proposalIdReceipt = (value: Option<string>): TxReceipt => ({
  html: getCommonReceiptHtml({
    linkType: "proposal_id",
    type: "explorer",
    value,
  }),
  title: "Proposal ID",
});

export const clientStateReceipt = (value: object): TxReceipt => ({
  html: getCommonReceiptHtml({ type: "json", value }),
  title: "Client State",
});

export const proofInitReceipt = (value: string): TxReceipt => ({
  title: "Proof Init",
  value,
});

export const proofHeightReceipt = (value: object): TxReceipt => ({
  html: getCommonReceiptHtml({ type: "json", value }),
  title: "Proof Height",
});

export const channelIdReceipt = (value: string): TxReceipt => ({
  title: "Channel ID",
  value,
});
