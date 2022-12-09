import type { MenuItemProps } from "@chakra-ui/react";
import { MenuItem, Icon, Flex, Text, Box } from "@chakra-ui/react";
import { useState } from "react";
import { MdBookmark, MdOutlineLaunch } from "react-icons/md";

import { Copier } from "lib/components/copier/index";
import { ListSelection } from "lib/components/forms/ListSelection";
import { ActionModal } from "lib/components/modal/ActionModal";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractInfo } from "lib/stores/contract";
import type { Option } from "lib/types";
import { truncate } from "lib/utils";

interface AddToOtherListProps {
  contractInfo: ContractInfo;
  menuItemProps: MenuItemProps;
}

export function AddToOtherList({
  contractInfo,
  menuItemProps,
}: AddToOtherListProps) {
  const [listResult, setListResult] = useState<Option[]>(
    contractInfo.lists ?? []
  );

  const handleSave = useHandleContractSave({
    title: "Action complete!",
    address: contractInfo.address,
    instantiator: contractInfo.instantiator,
    label: contractInfo.label,
    created: contractInfo.created,
    lists: listResult,
  });

  return (
    <ActionModal
      title="Add or remove from other lists"
      icon={MdBookmark}
      headerContent={
        <Flex pt="6" gap="36px">
          <Flex direction="column" gap="8px">
            <Text variant="body2" color="text.main" fontWeight="600">
              Contract Name
            </Text>
            <Text variant="body2" color="text.main" fontWeight="600">
              Contract Address
            </Text>
          </Flex>

          <Flex direction="column" gap="8px">
            <Text variant="body2" color="text.main">
              {contractInfo.name ?? contractInfo.label}
            </Text>
            <Flex alignItems="center" gap="16px">
              <Text variant="body2" color="primary.main">
                {truncate(contractInfo.address)}
              </Text>
              <Flex gap="1">
                <Copier value={contractInfo.address} ml="4" />
                <Icon as={MdOutlineLaunch} color="gray.400" boxSize="4" />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      }
      trigger={<MenuItem {...menuItemProps} />}
      mainBtnTitle="Save"
      mainAction={handleSave}
      otherBtnTitle="Cancel"
    >
      <Box my="16px">
        <ListSelection
          result={listResult}
          placeholder="Add to contract lists"
          helperText="Grouping your contracts by adding to your existing list or create
              a new list"
          setResult={(selectedOptions: Option[]) => {
            setListResult(selectedOptions);
          }}
        />
      </Box>
    </ActionModal>
  );
}
