import { EditableCell } from "../EditableCell";
import { useCelatoneApp } from "lib/app-provider";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { ContractLocalInfo } from "lib/stores/contract";

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
    instantiator: contractLocalInfo.instantiator,
    label: contractLocalInfo.label,
    actions: () => AmpTrack(AmpEvent.USE_QUICK_EDIT_CONTRACT),
  });
  return (
    <EditableCell
      initialValue={contractLocalInfo.name}
      defaultValue={contractLocalInfo.label}
      maxLength={constants.maxContractNameLength}
      tooltip={contractLocalInfo.description}
      isReadOnly={isReadOnly}
      onSave={!isReadOnly ? onSave : undefined}
    />
  );
};
