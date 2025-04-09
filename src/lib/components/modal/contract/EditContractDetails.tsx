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
    title="Edit contract details"
    subtitle="Filled information below will be saved on Scan only and able to edit later."
    contractLocalInfo={contractLocalInfo}
    triggerElement={triggerElement}
  />
);
