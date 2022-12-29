import type { MenuItemProps } from "@chakra-ui/react";
import { MenuItem, Flex, Text, Box } from "@chakra-ui/react";
import { useState } from "react";
import { MdBookmark } from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { ListSelection } from "lib/components/forms/ListSelection";
import { ActionModal } from "lib/components/modal/ActionModal";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractInfo } from "lib/stores/contract";
import type { Option } from "lib/types";

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
    contractAddress: contractInfo.contractAddress,
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
            <ExplorerLink
              value={contractInfo.contractAddress}
              type="contract_address"
            />
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
          labelBgColor="gray.800"
        />
      </Box>
    </ActionModal>
  );
}
