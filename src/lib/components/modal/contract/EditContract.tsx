import type { MenuItemProps } from "@chakra-ui/react";
import { MenuItem, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { ActionModal } from "lib/components/modal/ActionModal";
import { OffChainForm } from "lib/components/offchain/OffChainForm";
import {
  MAX_CONTRACT_DESCRIPTION_LENGTH,
  MAX_CONTRACT_NAME_LENGTH,
} from "lib/data";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractInfo } from "lib/stores/contract";
import type { Option } from "lib/types";

interface ModalProps {
  contractInfo: ContractInfo;
  menuItemProps: MenuItemProps;
}
export const EditContract = ({ contractInfo, menuItemProps }: ModalProps) => {
  const [name, setName] = useState<string>(contractInfo.name ?? "");
  const [description, setDescription] = useState<string>(
    contractInfo.description ?? ""
  );
  const [tags, setTags] = useState<string[]>(contractInfo.tags ?? []);
  const [lists, setLists] = useState<Option[]>(contractInfo.lists ?? []);

  const reset = () => {
    setName(contractInfo.name ?? "");
    setDescription(contractInfo.description ?? "");
    setTags(contractInfo.tags ?? []);
    setLists(contractInfo.lists ?? []);
  };

  const handleSave = useHandleContractSave({
    title: "Action Complete",
    address: contractInfo.address,
    instantiator: contractInfo.instantiator,
    label: contractInfo.label,
    created: contractInfo.created,
    name,
    description,
    tags,
    lists,
  });

  return (
    <ActionModal
      title="Edit Contract Details"
      subtitle="Filled information below will be saved on Celatone only and able
              to edit later."
      headerContent={
        <Flex gap={4} alignItems="center" pt="6">
          <Text variant="body2" color="text.main" fontWeight="600">
            Contract Address
          </Text>
          <ExplorerLink value={contractInfo.address} type="contract_address" />
        </Flex>
      }
      trigger={<MenuItem {...menuItemProps} />}
      mainBtnTitle="Save"
      mainAction={handleSave}
      // TODO: apply use-react-form later
      disabledMain={
        name.trim().length > MAX_CONTRACT_NAME_LENGTH ||
        description.trim().length > MAX_CONTRACT_DESCRIPTION_LENGTH
      }
      otherBtnTitle="Cancel"
      otherAction={reset}
    >
      <OffChainForm
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        tags={tags}
        setTags={setTags}
        lists={lists}
        setLists={setLists}
        cta={false}
      />
    </ActionModal>
  );
};
