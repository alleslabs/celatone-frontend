import type { Coin } from "@cosmjs/stargate";
import type { AddressReturnType } from "lib/app-provider";
import type { LinkType } from "lib/components/ExplorerLink";
import type {
  BechAddr,
  Nullable,
  Option,
  TxReceipt,
  ValidatorAddr,
} from "lib/types";

import { Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { convertToTitle } from "lib/utils";

import { CoinsComponent } from "./CoinsComponent";

type HtmlType = "json" | "explorer";

interface CommonReceiptHtmlArgs<T extends HtmlType, V> {
  type: T;
  value: Option<Nullable<V>>;
  linkType?: LinkType;
  fallback?: string;
}

// Util Functions
export const getCommonReceiptHtml = <T extends HtmlType>({
  type,
  value,
  linkType = "invalid_address",
  fallback,
}: CommonReceiptHtmlArgs<T, T extends "json" ? object : string>) => {
  switch (true) {
    case value === null:
      return (
        <Text color="gray.600" variant="body2">
          null
        </Text>
      );
    case Boolean(!value && fallback):
      return (
        <Text color="text.dark" variant="body2">
          {fallback}
        </Text>
      );
    case !value:
      return (
        <Text color="warning.dark" variant="body2">
          Data not found
        </Text>
      );
    // TODO: Find a solution, TS doesn't know that type === "json" would make typeof value === "object"
    case type === "json" || typeof value === "object":
      return (
        <JsonReadOnly
          amptrackSection="tx_page_msg_receipts"
          canCopy
          fullWidth
          isExpandable
          text={JSON.stringify(value, null, 2)}
        />
      );
    default:
      return (
        <ExplorerLink
          ampCopierSection="tx_msg_receipts"
          maxWidth="full"
          showCopyOnHover
          textFormat="normal"
          type={linkType}
          value={value as string}
          wordBreak="break-word"
        />
      );
  }
};

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

export const attachFundsReceipt = (value: Option<Coin[]>): TxReceipt => ({
  title: "Attached funds",
  html: value?.length ? (
    <CoinsComponent coins={value} />
  ) : (
    <Text variant="body2" color="text.dark">
      No attached funds
    </Text>
  ),
});

export const delegatorAddrReceipt = (
  value: BechAddr,
  addrType: LinkType
): TxReceipt => ({
  title: "Delegator address",
  html: getCommonReceiptHtml({
    type: "explorer",
    value,
    linkType: addrType,
  }),
});

export const validatorAddrReceipt = (value: ValidatorAddr): TxReceipt => ({
  title: "Validator address",
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
  title: "Client state",
  html: getCommonReceiptHtml({ type: "json", value }),
});

export const proofInitReceipt = (value: string): TxReceipt => ({
  title: "Proof init",
  value,
});

export const proofHeightReceipt = (value: object): TxReceipt => ({
  title: "Proof height",
  html: getCommonReceiptHtml({ type: "json", value }),
});

export const channelIdReceipt = (value: string): TxReceipt => ({
  title: "Channel ID",
  value,
});
