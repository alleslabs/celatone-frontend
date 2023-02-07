import type { ContractLocalInfo } from "lib/stores/contract";

import { ContractDetailsTemplate } from "./ContractDetailsTemplate";

interface EditContractDetailsProps {
  contractLocalInfo: ContractLocalInfo;
  triggerElement: JSX.Element;
}
export const EditContractDetails = ({
  contractLocalInfo,
  triggerElement,
}: EditContractDetailsProps) => (
  <ContractDetailsTemplate
    title="Edit Contract Details"
    subtitle="Filled information below will be saved on Celatone only and able to edit later."
    contractLocalInfo={contractLocalInfo}
    triggerElement={triggerElement}
  />
);
