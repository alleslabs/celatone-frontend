import type { DecodeModuleQueryResponse } from "lib/services/types";
import type { Option } from "lib/types";

import { UpgradePolicy } from "lib/types";

type Status = "error" | "info" | "init";

export interface PublishStatus {
  status: Status;
  text: string;
}

export interface Module {
  base64EncodedFile: string;
  decodeRes: Option<DecodeModuleQueryResponse>;
  file: Option<File>;
  publishStatus: PublishStatus;
}

export interface PublishModuleState {
  modules: Module[];
  upgradePolicy: UpgradePolicy;
}

export const PUBLISH_STATUS_DEFAULT: PublishStatus = {
  status: "init",
  text: "",
};

export const emptyModule: Module = {
  base64EncodedFile: "",
  decodeRes: undefined,
  file: undefined,
  publishStatus: PUBLISH_STATUS_DEFAULT,
};

export const POLICIES = [
  {
    condition: true,
    description:
      "This address can publish these modules again but need to maintain several properties.",
    value: UpgradePolicy.COMPATIBLE,
  },
  {
    condition: false,
    description: "You cannot publish these modules again with this address",
    value: UpgradePolicy.IMMUTABLE,
  },
];

export const defaultValues: PublishModuleState = {
  modules: [emptyModule],
  upgradePolicy: UpgradePolicy.COMPATIBLE,
};
