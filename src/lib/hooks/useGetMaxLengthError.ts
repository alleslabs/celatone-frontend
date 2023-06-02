import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";

export const useGetMaxLengthError = () => {
  const { constants } = useCelatoneApp();
  return useCallback(
    (
      field: string,
      currentLength: number,
      type:
        | "contract_name"
        | "contract_desc"
        | "code_name"
        | "proposal_title"
        | "list_name"
    ) => {
      let maxLength = 0;
      switch (type) {
        case "contract_name":
          maxLength = constants.maxContractNameLength;
          break;
        case "contract_desc":
          maxLength = constants.maxContractDescriptionLength;
          break;
        case "code_name":
          maxLength = constants.maxCodeNameLength;
          break;
        case "proposal_title":
          maxLength = constants.maxProposalTitleLength;
          break;
        case "list_name":
          maxLength = constants.maxListNameLength;
          break;
        default:
          break;
      }
      return `${field} is too long. (${currentLength}/${maxLength})`;
    },
    [
      constants.maxCodeNameLength,
      constants.maxContractDescriptionLength,
      constants.maxContractNameLength,
      constants.maxListNameLength,
      constants.maxProposalTitleLength,
    ]
  );
};
