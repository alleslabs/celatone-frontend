import type { MenuItemProps } from "@chakra-ui/react";
import { MenuItem, Text, Highlight } from "@chakra-ui/react";

import { ActionModal } from "lib/components/modal/ActionModal";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";
import { truncate } from "lib/utils";

interface RemoveContractModalProps {
  contractLocalInfo: ContractLocalInfo;
  contractRemovalInfo: LVPair;
  menuItemProps: MenuItemProps;
}

export function RemoveContractModal({
  contractLocalInfo,
  contractRemovalInfo,
  menuItemProps,
}: RemoveContractModalProps) {
  const displayName = contractLocalInfo.name
    ? contractLocalInfo.name
    : truncate(contractLocalInfo.contractAddress);

  const handleRemove = useHandleContractSave({
    title: `Removed ${displayName} from ${contractRemovalInfo.label}`,
    contractAddress: contractLocalInfo.contractAddress,
    instantiator: contractLocalInfo.instantiator,
    label: contractLocalInfo.label,
    lists: contractLocalInfo.lists?.filter(
      (item) => item.value !== contractRemovalInfo.value
    ),
    actions: () => AmpTrack(AmpEvent.CONTRACT_REMOVE),
  });

  return (
    <ActionModal
      title={`Remove ${displayName}?`}
      icon="delete"
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
