import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";

type MaxLengthType =
  | "contract_name"
  | "contract_desc"
  | "code_name"
  | "proposal_title"
  | "list_name";

export const useGetMaxLengthError = () => {
  const { constants } = useCelatoneApp();
  return useCallback(
    (currentLength: number, type: MaxLengthType) => {
      const maxLengthMap: Record<MaxLengthType, number> = {
        contract_name: constants.maxContractNameLength,
        contract_desc: constants.maxContractDescriptionLength,
        code_name: constants.maxCodeNameLength,
        proposal_title: constants.maxProposalTitleLength,
        list_name: constants.maxListNameLength,
      };

      const fieldMap: Record<MaxLengthType, string> = {
        contract_name: "Contract name",
        contract_desc: "Contract description",
        code_name: "Code name",
        proposal_title: "Proposal title",
        list_name: "List name",
      };

      const maxLength = maxLengthMap[type] ?? 0;
      const fieldName = fieldMap[type] ?? "Unknown field";

      return `${fieldName} is too long. (${currentLength}/${maxLength})`;
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
