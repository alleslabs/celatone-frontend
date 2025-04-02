import { useCelatoneApp } from "lib/app-provider";
import { useCallback } from "react";

type MaxLengthType =
  | "account_name"
  | "account_desc"
  | "proposal_title"
  | "code_name"
  | "contract_name"
  | "contract_desc"
  | "list_name";

export const useGetMaxLengthError = () => {
  const { constants } = useCelatoneApp();
  return useCallback(
    (currentLength: number, type: MaxLengthType) => {
      const maxLengthMap: Record<MaxLengthType, number> = {
        account_name: constants.maxAccountNameLength,
        account_desc: constants.maxAccountDescriptionLength,
        proposal_title: constants.maxProposalTitleLength,
        code_name: constants.maxCodeNameLength,
        contract_name: constants.maxContractNameLength,
        contract_desc: constants.maxContractDescriptionLength,
        list_name: constants.maxListNameLength,
      };

      const fieldMap: Record<MaxLengthType, string> = {
        account_name: "Account Name",
        account_desc: "Account Description",
        proposal_title: "Proposal title",
        code_name: "Code name",
        contract_name: "Contract name",
        contract_desc: "Contract description",
        list_name: "List name",
      };

      const maxLength = maxLengthMap[type] ?? 0;
      const fieldName = fieldMap[type] ?? "Unknown field";

      return `${fieldName} is too long. (${currentLength}/${maxLength})`;
    },
    [constants]
  );
};
