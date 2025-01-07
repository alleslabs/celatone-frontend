import { DEFAULT_LIST } from "lib/data";
import type { ContractLocalInfo } from "lib/stores/contract";

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
    defaultList={DEFAULT_LIST}
    isSave
    title="Save Contract Details"
    triggerElement={triggerElement}
    contractLocalInfo={contractLocalInfo}
    icon="bookmark-solid"
  />
);
