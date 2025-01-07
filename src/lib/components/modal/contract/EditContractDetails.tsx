import type { ContractLocalInfo } from "lib/stores/contract";

import { ContractDetailsTemplateModal } from "./ContractDetailsTemplate";

interface EditContractDetailsModalProps {
  contractLocalInfo: ContractLocalInfo;
  triggerElement: JSX.Element;
}
export const EditContractDetailsModal = ({
  contractLocalInfo,
  triggerElement,
}: EditContractDetailsModalProps) => (
  <ContractDetailsTemplateModal
    subtitle="Filled information below will be saved on Celatone only and able to edit later."
    title="Edit Contract Details"
    triggerElement={triggerElement}
    contractLocalInfo={contractLocalInfo}
  />
);
