import type { ContractInfo } from "lib/stores/contract";

import { ContractDetailsTemplate } from "./ContractDetailsTemplate";

interface EditContractDetailsProps {
  contractInfo: ContractInfo;
  triggerElement: JSX.Element;
}
export const EditContractDetails = ({
  contractInfo,
  triggerElement,
}: EditContractDetailsProps) => (
  <ContractDetailsTemplate
    title="Edit Contract Details"
    subtitle="Filled information below will be saved on Celatone only and able to edit later."
    contractInfo={contractInfo}
    triggerElement={triggerElement}
  />
);
