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

type HtmlType = "explorer" | "json";

interface CommonReceiptHtmlArgs<T extends HtmlType, V> {
  fallback?: string;
  linkType?: LinkType;
  queryParams?: Record<string, string>;
  textLabel?: string;
  type: T;
  value: Option<Nullable<V>>;
}

// Util Functions
export const getCommonReceiptHtml = <T extends HtmlType>({
  fallback,
  linkType = "invalid_address",
  queryParams,
  textLabel,
  type,
  value,
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
    case !value && linkType !== "function_name":
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
          queryParams={queryParams ?? {}}
          showCopyOnHover
          textFormat="normal"
          textLabel={textLabel}
          type={linkType}
          value={value as string}
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
    <Text color="text.dark" variant="body2">
      No attached funds
    </Text>
  ),
  title: "Attached funds",
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
  title: "Delegator address",
});

export const validatorAddrReceipt = (value: ValidatorAddr): TxReceipt => ({
  html: getCommonReceiptHtml({
    linkType: "validator_address",
    type: "explorer",
    value,
  }),
  title: "Validator address",
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
  title: "Client state",
});

export const proofInitReceipt = (value: string): TxReceipt => ({
  title: "Proof init",
  value,
});

export const proofHeightReceipt = (value: object): TxReceipt => ({
  html: getCommonReceiptHtml({ type: "json", value }),
  title: "Proof height",
});

export const channelIdReceipt = (value: string): TxReceipt => ({
  title: "Channel ID",
  value,
});
