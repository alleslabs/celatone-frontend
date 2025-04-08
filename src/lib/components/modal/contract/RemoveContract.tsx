import type { MenuItemProps } from "@chakra-ui/react";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";

import { Highlight, MenuItem, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { ActionModal } from "lib/components/modal/ActionModal";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
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
    label: contractLocalInfo.label,
    codeId: contractLocalInfo.codeId,
    instantiator: contractLocalInfo.instantiator,
    lists: contractLocalInfo.lists?.filter(
      (item) => item.value !== contractRemovalInfo.value
    ),
    actions: () => track(AmpEvent.CONTRACT_REMOVE),
  });

  return (
    <ActionModal
      icon="delete"
      iconColor="error.light"
      mainBtnTitle="Yes, remove"
      mainVariant="error"
      mainAction={handleRemove}
      otherBtnTitle="No, keep it"
      trigger={<MenuItem {...menuItemProps} as="button" />}
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
