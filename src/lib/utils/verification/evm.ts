import { EVMVerifyLicenseType } from "lib/services/types";

export const getLicenseTypeLabel = (
  license: EVMVerifyLicenseType,
  withOrderNumber = true
) => {
  const licenseLabels = {
    [EVMVerifyLicenseType.None]: "No License (None)",
    [EVMVerifyLicenseType.Unlicense]: "The Unlicense (Unlicense)",
    [EVMVerifyLicenseType.MIT]: "MIT License (MIT)",
    [EVMVerifyLicenseType.GNUGPLv2]:
      "GNU General Public License v2.0 (GNU GPLv2)",
    [EVMVerifyLicenseType.GNUGPLv3]:
      "GNU General Public License v3.0 (GNU GPLv3)",
    [EVMVerifyLicenseType.GNULGPLv2_1]:
      "GNU Lesser General Public License v2.1 (GNU LGPLv2.1)",
    [EVMVerifyLicenseType.GNULGPLv3]:
      "GNU Lesser General Public License v3.0 (GNU LGPLv3)",
    [EVMVerifyLicenseType.BSD2Clause]: `BSD 2-Clause "Simplified" license (BSD 2-Clause)`,
    [EVMVerifyLicenseType.BSD3Clause]: `BSD 3-Clause "New" or "Revised" license (BSD 3-Clause)`,
    [EVMVerifyLicenseType.MPL2_0]: "Mozilla Public License 2.0 (MPL 2.0)",
    [EVMVerifyLicenseType.OSL3_0]: "Open Software License 3.0 (OSL 3.0)",
    [EVMVerifyLicenseType.Apache2_0]: "Apache 2.0 (Apache 2.0)",
    [EVMVerifyLicenseType.GNUAGPLv3]:
      "GNU Affero General Public License (GNU AGPLv3)",
    [EVMVerifyLicenseType.BSL1_1]: "Business Source License (BSL 1.1)",
  };

  const orderNumber = Object.keys(licenseLabels).indexOf(license) + 1;
  const label = licenseLabels[license] || "";

  return withOrderNumber && label ? `${orderNumber}. ${label}` : label;
};
