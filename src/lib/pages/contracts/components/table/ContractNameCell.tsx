import { EditableCell } from "lib/components/table";
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
    address: contract.address,
    instantiator: contract.instantiator,
    label: contract.label,
    created: contract.created,
  });
  return (
    <EditableCell
      initialValue={contract.name}
      defaultValue={contract.label}
      tooltip={contract.description}
      onSave={!isReadOnly ? onSave : undefined}
    />
  );
};
