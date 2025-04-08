import type { ContractLocalInfo } from "lib/stores/contract";

import { JSX } from "react";

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
    contractLocalInfo={contractLocalInfo}
    subtitle="Filled information below will be saved on Scan only and able to edit later."
    title="Edit contract details"
    triggerElement={triggerElement}
  />
);
