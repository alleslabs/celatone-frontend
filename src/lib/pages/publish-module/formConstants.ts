import type { DecodeModuleQueryResponse } from "lib/services/types";
import type { Option } from "lib/types";
import { UpgradePolicy } from "lib/types";

type Status = "error" | "info" | "init";

export interface PublishStatus {
  status: Status;
  text: string;
}

export interface Module {
  file: Option<File>;
  base64EncodedFile: string;
  decodeRes: Option<DecodeModuleQueryResponse>;
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
  publishStatus: PUBLISH_STATUS_DEFAULT,
  file: undefined,
};

export const POLICIES = [
  {
    value: UpgradePolicy.COMPATIBLE,
    description:
      "This address can publish these modules again but need to maintain several properties.",
    condition: true,
  },
  {
    value: UpgradePolicy.IMMUTABLE,
    description: "You cannot publish these modules again with this address",
    condition: false,
  },
];

export const defaultValues: PublishModuleState = {
  modules: [emptyModule],
  upgradePolicy: UpgradePolicy.COMPATIBLE,
};
