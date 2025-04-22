import { useCelatoneApp } from "lib/app-provider";
import { useCallback } from "react";

type MaxLengthType =
  | "account_desc"
  | "account_name"
  | "code_name"
  | "contract_desc"
  | "contract_name"
  | "list_name"
  | "proposal_title";

export const useGetMaxLengthError = () => {
  const { constants } = useCelatoneApp();
  return useCallback(
    (currentLength: number, type: MaxLengthType) => {
      const maxLengthMap: Record<MaxLengthType, number> = {
        account_desc: constants.maxAccountDescriptionLength,
        account_name: constants.maxAccountNameLength,
        code_name: constants.maxCodeNameLength,
        contract_desc: constants.maxContractDescriptionLength,
        contract_name: constants.maxContractNameLength,
        list_name: constants.maxListNameLength,
        proposal_title: constants.maxProposalTitleLength,
      };

      const fieldMap: Record<MaxLengthType, string> = {
        account_desc: "Account description",
        account_name: "Account name",
        code_name: "Code name",
        contract_desc: "Contract description",
        contract_name: "Contract name",
        list_name: "List name",
        proposal_title: "Proposal title",
      };

      const maxLength = maxLengthMap[type] ?? 0;
      const fieldName = fieldMap[type] ?? "Unknown field";

      return `${fieldName} is too long. (${currentLength}/${maxLength})`;
    },
    [constants]
  );
};
