import { EvmVerifyLicenseType } from "lib/types";

export const getLicenseTypeLabel = (license: EvmVerifyLicenseType) => {
  switch (license) {
    case EvmVerifyLicenseType.None:
      return "No License (None)";
    case EvmVerifyLicenseType.Unlicense:
      return "The Unlicense (Unlicense)";
    case EvmVerifyLicenseType.MIT:
      return "MIT License (MIT)";
    case EvmVerifyLicenseType.GNUGPLv2:
      return "GNU General Public License v2.0 (GNU GPLv2)";
    case EvmVerifyLicenseType.GNUGPLv3:
      return "GNU General Public License v3.0 (GNU GPLv3)";
    case EvmVerifyLicenseType.GNULGPLv2_1:
      return "GNU Lesser General Public License v2.1 (GNU LGPLv2.1)";
    case EvmVerifyLicenseType.GNULGPLv3:
      return "GNU Lesser General Public License v3.0 (GNU LGPLv3)";
    case EvmVerifyLicenseType.BSD2Clause:
      return `BSD 2-Clause "Simplified" license (BSD 2-Clause)`;
    case EvmVerifyLicenseType.BSD3Clause:
      return `BSD 3-Clause "New" or "Revised" license (BSD 3-Clause)`;
    case EvmVerifyLicenseType.MPL2_0:
      return "Mozilla Public License 2.0 (MPL 2.0)";
    case EvmVerifyLicenseType.OSL3_0:
      return "Open Software License 3.0 (OSL 3.0)";
    case EvmVerifyLicenseType.Apache2_0:
      return "Apache 2.0 (Apache 2.0)";
    case EvmVerifyLicenseType.GNUAGPLv3:
      return "GNU Affero General Public License (GNU AGPLv3)";
    case EvmVerifyLicenseType.BSL1_1:
      return "Business Source License (BSL 1.1)";
    default:
      return "";
  }
};
