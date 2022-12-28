import type { ContractInfo } from "lib/stores/contract";

import { ContractDetailsTemplate } from "./ContractDetailsTemplate";

interface SaveContractDetailsProps {
  contractInfo: ContractInfo;
  triggerElement: JSX.Element;
}
export const SaveContractDetails = ({
  contractInfo,
  triggerElement,
}: SaveContractDetailsProps) => (
  <ContractDetailsTemplate
    title="Save Contract Details"
    contractInfo={contractInfo}
    triggerElement={triggerElement}
  />
);
