import type { ContractLocalInfo } from "lib/stores/contract";

import { DEFAULT_LIST } from "lib/data";

import { ContractDetailsTemplateModal } from "./ContractDetailsTemplate";

interface SaveContractDetailsProps {
  contractLocalInfo: ContractLocalInfo;
  triggerElement: JSX.Element;
}
export const SaveContractDetailsModal = ({
  contractLocalInfo,
  triggerElement,
}: SaveContractDetailsProps) => (
  <ContractDetailsTemplateModal
    contractLocalInfo={contractLocalInfo}
    defaultList={DEFAULT_LIST}
    icon="bookmark-solid"
    icon="bookmark-solid"
    isSave
    title="Save contract details"
    title="Save Contract Details"
    triggerElement={triggerElement}
  />
);
