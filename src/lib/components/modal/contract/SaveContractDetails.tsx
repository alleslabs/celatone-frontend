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
    title="Save contract details"
    icon="bookmark-solid"
    contractLocalInfo={contractLocalInfo}
    triggerElement={triggerElement}
    defaultList={DEFAULT_LIST}
    isSave
  />
);
