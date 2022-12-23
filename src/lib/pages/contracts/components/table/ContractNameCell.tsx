import { EditableCell } from "lib/components/table";
import { MAX_CONTRACT_NAME_LENGTH } from "lib/data";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractInfo } from "lib/stores/contract";

interface ContractNameCellProps {
  contract: ContractInfo;
  isReadOnly?: boolean;
}

export const ContractNameCell = ({
  contract,
  isReadOnly = false,
}: ContractNameCellProps) => {
  const onSave = useHandleContractSave({
    title: "Changed name successfully!",
    contractAddress: contract.address,
    instantiator: contract.instantiator,
    label: contract.label,
    created: contract.created,
  });
  return (
    <EditableCell
      initialValue={contract.name}
      defaultValue={contract.label}
      maxLength={MAX_CONTRACT_NAME_LENGTH}
      tooltip={contract.description}
      onSave={!isReadOnly ? onSave : undefined}
    />
  );
};
