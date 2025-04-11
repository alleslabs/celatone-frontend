import type { ContractLocalInfo } from "lib/stores/contract";

import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider";
import { useHandleContractSave } from "lib/hooks/useHandleSave";

import { EditableCell } from "../EditableCell";

interface ContractNameCellProps {
  contractLocalInfo: ContractLocalInfo;
  isReadOnly?: boolean;
}

export const ContractNameCell = ({
  contractLocalInfo,
  isReadOnly = false,
}: ContractNameCellProps) => {
  const { constants } = useCelatoneApp();
  const onSave = useHandleContractSave({
    title: "Changed name successfully!",
    contractAddress: contractLocalInfo.contractAddress,
    label: contractLocalInfo.label,
    codeId: contractLocalInfo.codeId,
    instantiator: contractLocalInfo.instantiator,
    actions: () => track(AmpEvent.USE_QUICK_EDIT_CONTRACT),
  });

  return (
    <EditableCell
      defaultValue={
        contractLocalInfo.label.length > 0
          ? contractLocalInfo.label
          : "Untitled"
      }
      initialValue={contractLocalInfo.name}
      isReadOnly={isReadOnly}
      maxLength={constants.maxContractNameLength}
      tooltip={contractLocalInfo.description}
      onSave={!isReadOnly ? onSave : undefined}
    />
  );
};
