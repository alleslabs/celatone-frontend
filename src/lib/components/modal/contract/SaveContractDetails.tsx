import type { ContractLocalInfo } from "lib/stores/contract";

import { ContractDetailsTemplate } from "./ContractDetailsTemplate";

interface SaveContractDetailsProps {
  contractLocalInfo: ContractLocalInfo;
  triggerElement: JSX.Element;
}
export const SaveContractDetails = ({
  contractLocalInfo,
  triggerElement,
}: SaveContractDetailsProps) => (
  <ContractDetailsTemplate
    title="Save Contract Details"
    contractLocalInfo={contractLocalInfo}
    triggerElement={triggerElement}
    isSave
  />
);
