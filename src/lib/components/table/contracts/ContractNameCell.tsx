import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractLocalInfo } from "lib/stores/contract";
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
      initialValue={contractLocalInfo.name}
      defaultValue={
        contractLocalInfo.label.length > 0
          ? contractLocalInfo.label
          : "Untitled"
      }
      maxLength={constants.maxContractNameLength}
      tooltip={contractLocalInfo.description}
      isReadOnly={isReadOnly}
      onSave={!isReadOnly ? onSave : undefined}
    />
  );
};
