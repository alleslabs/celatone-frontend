import type { MenuItemProps } from "@chakra-ui/react";
import { Highlight, MenuItem, Text } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { ActionModal } from "lib/components/modal/ActionModal";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
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
    actions: () => track(AmpEvent.CONTRACT_REMOVE),
    codeId: contractLocalInfo.codeId,
    contractAddress: contractLocalInfo.contractAddress,
    instantiator: contractLocalInfo.instantiator,
    label: contractLocalInfo.label,
    lists: contractLocalInfo.lists?.filter(
      (item) => item.value !== contractRemovalInfo.value
    ),
    title: `Removed ${displayName} from ${contractRemovalInfo.label}`,
  });

  return (
    <ActionModal
      mainBtnTitle="Yes, Remove"
      mainVariant="error"
      title={`Remove ${displayName}?`}
      trigger={<MenuItem {...menuItemProps} as="button" />}
      icon="delete"
      iconColor="error.light"
      mainAction={handleRemove}
      otherBtnTitle="No, Keep It"
    >
      <Text>
        <Highlight
          styles={{ color: "inherit", fontWeight: "bold" }}
          query={[displayName, contractRemovalInfo.label]}
        >
          {`This action will remove ${displayName} from ${contractRemovalInfo.label}. 
        The contract’s off-chain detail will be preserved in other lists or when you save this contract again.`}
        </Highlight>
      </Text>
    </ActionModal>
  );
}
