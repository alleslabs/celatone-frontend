import type { MenuItemProps } from "@chakra-ui/react";
import { MenuItem, Text, Highlight } from "@chakra-ui/react";
import { MdDeleteForever } from "react-icons/md";

import { ActionModal } from "lib/components/modal/ActionModal";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractInfo } from "lib/stores/contract";
import type { Option } from "lib/types";
import { truncate } from "lib/utils";

interface ModalProps {
  contractInfo: ContractInfo;
  contractRemovalInfo: Option;
  menuItemProps: MenuItemProps;
}

export function RemoveContract({
  contractInfo,
  contractRemovalInfo,
  menuItemProps,
}: ModalProps) {
  const displayName = contractInfo.name
    ? contractInfo.name
    : truncate(contractInfo.contractAddress);

  const handleRemove = useHandleContractSave({
    title: `Removed ${displayName} from ${contractRemovalInfo.label}`,
    contractAddress: contractInfo.contractAddress,
    instantiator: contractInfo.instantiator,
    label: contractInfo.label,
    created: contractInfo.created,
    lists: contractInfo.lists?.filter(
      (item) => item.value !== contractRemovalInfo.value
    ),
  });

  return (
    <ActionModal
      title={`Remove ${displayName}?`}
      icon={MdDeleteForever}
      iconColor="error.light"
      mainBtnTitle="Yes, Remove"
      mainAction={handleRemove}
      otherBtnTitle="No, Keep It"
      trigger={<MenuItem {...menuItemProps} />}
    >
      <Text>
        <Highlight
          query={[displayName, contractRemovalInfo.label]}
          styles={{ fontWeight: "bold", color: "inherit" }}
        >
          {`This action will remove ${displayName} from ${contractRemovalInfo.label}. 
        The contract’s off-chain detail will be preserved in other lists or when you save this contract again.`}
        </Highlight>
      </Text>
    </ActionModal>
  );
}
