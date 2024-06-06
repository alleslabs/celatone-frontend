import type { DecodeModuleQueryResponse } from "lib/services/types";
import type { BechAddr20, Option } from "lib/types";
import { UpgradePolicy } from "lib/types";
import { bech32AddressToHex, truncate, unpadHexAddress } from "lib/utils";

import type { Module, PublishStatus } from "./formConstants";
import { PUBLISH_STATUS_DEFAULT } from "./formConstants";

const priority = Object.keys(UpgradePolicy);

const resolvePolicyPriority = (
  selected: UpgradePolicy,
  current: UpgradePolicy
) => priority.indexOf(selected) >= priority.indexOf(current);

export const statusResolver = ({
  data,
  modules,
  index,
  policy,
  address,
}: {
  data: Option<DecodeModuleQueryResponse>;
  modules: Module[];
  index: number;
  policy: UpgradePolicy;
  address: Option<BechAddr20>;
}): PublishStatus => {
  if (!data) return PUBLISH_STATUS_DEFAULT;

  const { abi, currentPolicy, modulePath } = data;

  const validPublisher = address
    ? unpadHexAddress(bech32AddressToHex(address)) === abi.address
    : false;

  const priorUpload = modules
    .slice(0, index)
    .findLast((field) => field.decodeRes?.modulePath === modulePath);

  const policyUpdateText = `Its upgrade policy will be updated from ${currentPolicy} to ${policy}`;

  // Check module address and connected wallet address equality
  if (!validPublisher)
    return {
      status: "error",
      text: `This .mv file can be published by ${truncate(abi.address)} only.`,
    };
  // Condition check for existing module, break switch case for non-existing
  switch (currentPolicy) {
    // Policy check
    // IMMUTABLE -> cannot be republished
    // COMPATIBLE -> can be republished as COMPATIBLE and IMMUTABLE only
    case UpgradePolicy.IMMUTABLE:
      return {
        status: "error",
        text: `“${abi.name}” is published with “Immutable” policy, which cannot be republished.`,
      };
    case policy:
      return {
        status: "info",
        text: `The file will be uploaded to republish module “${abi.name}” in your address.`,
      };
    case undefined:
      break;
    default: {
      if (policy === UpgradePolicy.IMMUTABLE && priorUpload)
        return {
          status: "error",
          text: `“${abi.name}” is published with “Immutable” policy, which cannot be republished.`,
        };
      return resolvePolicyPriority(policy, currentPolicy)
        ? {
            status: "info",
            text: `The file will be uploaded to republish module “${abi.name}” in your address. ${policyUpdateText}`,
          }
        : {
            status: "error",
            text: `“${abi.name}” is published with “${currentPolicy}” policy, which cannot be republished to “${policy}”`,
          };
    }
  }
  // Condition check for non-existing module with identical module file uploaded
  if (priorUpload) {
    if (policy === UpgradePolicy.IMMUTABLE)
      return {
        status: "error",
        text: `“${abi.name}” is published with “Immutable” policy, which cannot be republished.`,
      };
    return {
      status: "info",
      text: `The file will be uploaded to republish module “${abi.name}” in your address.`,
    };
  }
  return PUBLISH_STATUS_DEFAULT;
};
