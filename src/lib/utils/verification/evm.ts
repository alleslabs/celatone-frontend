import { EVMVerifyLicenseType } from "lib/services/types";

export const getLicenseTypeLabel = (license: EVMVerifyLicenseType) => {
  switch (license) {
    case EVMVerifyLicenseType.None:
      return "No License (None)";
    case EVMVerifyLicenseType.Unlicense:
      return "The Unlicense (Unlicense)";
    case EVMVerifyLicenseType.MIT:
      return "MIT License (MIT)";
    case EVMVerifyLicenseType.GNUGPLv2:
      return "GNU General Public License v2.0 (GNU GPLv2)";
    case EVMVerifyLicenseType.GNUGPLv3:
      return "GNU General Public License v3.0 (GNU GPLv3)";
    case EVMVerifyLicenseType.GNULGPLv2_1:
      return "GNU Lesser General Public License v2.1 (GNU LGPLv2.1)";
    case EVMVerifyLicenseType.GNULGPLv3:
      return "GNU Lesser General Public License v3.0 (GNU LGPLv3)";
    case EVMVerifyLicenseType.BSD2Clause:
      return `BSD 2-Clause "Simplified" license (BSD 2-Clause)`;
    case EVMVerifyLicenseType.BSD3Clause:
      return `BSD 3-Clause "New" or "Revised" license (BSD 3-Clause)`;
    case EVMVerifyLicenseType.MPL2_0:
      return "Mozilla Public License 2.0 (MPL 2.0)";
    case EVMVerifyLicenseType.OSL3_0:
      return "Open Software License 3.0 (OSL 3.0)";
    case EVMVerifyLicenseType.Apache2_0:
      return "Apache 2.0 (Apache 2.0)";
    case EVMVerifyLicenseType.GNUAGPLv3:
      return "GNU Affero General Public License (GNU AGPLv3)";
    case EVMVerifyLicenseType.BSL1_1:
      return "Business Source License (BSL 1.1)";
    default:
      return "";
  }
};
