import type { MenuItemProps } from "@chakra-ui/react";
import { MenuItem, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

import { Copier } from "lib/components/copier/index";
import { ActionModal } from "lib/components/modal/ActionModal";
import { OffChainForm } from "lib/components/OffChain/OffChainForm";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractInfo } from "lib/stores/contract";
import type { Option } from "lib/types";
import { truncate } from "lib/utils";

interface ModalProps {
  contractInfo: ContractInfo;
  menuItemProps: MenuItemProps;
}
export const EditContract = ({ contractInfo, menuItemProps }: ModalProps) => {
  const [name, setName] = useState<string>(
    contractInfo.name ?? contractInfo.label
  );
  const [description, setDescription] = useState<string>(
    contractInfo.description ?? ""
  );
  const [tags, setTags] = useState<string[]>(contractInfo.tags ?? []);
  const [lists, setLists] = useState<Option[]>(contractInfo.lists ?? []);

  const reset = () => {
    setName(contractInfo.name ?? contractInfo.label);
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
          <Text variant="body2" color="text.dark">
            {truncate(contractInfo.address)}
          </Text>
          <Flex gap="1">
            <Copier value={contractInfo.address} ml="4" />
          </Flex>
        </Flex>
      }
      trigger={<MenuItem {...menuItemProps} />}
      mainBtnTitle="Save"
      mainAction={handleSave}
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
