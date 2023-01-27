import { Flex, Text, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { MdBookmark } from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { ListSelection } from "lib/components/forms/ListSelection";
import { ActionModal } from "lib/components/modal/ActionModal";
import { DEFAULT_LIST } from "lib/data";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";

interface AddToOtherListProps {
  contractLocalInfo: ContractLocalInfo;
  triggerElement: JSX.Element;
}

export const AddToOtherList = observer(
  ({ contractLocalInfo, triggerElement }: AddToOtherListProps) => {
    const [contractLists, setContractLists] = useState<LVPair[]>(DEFAULT_LIST);

    const handleSave = useHandleContractSave({
      title: "Action Complete!",
      contractAddress: contractLocalInfo.contractAddress,
      instantiator: contractLocalInfo.instantiator,
      label: contractLocalInfo.label,
      lists: contractLists,
    });

    useEffect(() => {
      if (contractLocalInfo.lists?.length) {
        setContractLists(contractLocalInfo.lists);
      } else {
        setContractLists(DEFAULT_LIST);
      }
    }, [contractLocalInfo.lists]);

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
                {contractLocalInfo.name ?? contractLocalInfo.label}
              </Text>
              <ExplorerLink
                value={contractLocalInfo.contractAddress}
                type="contract_address"
              />
            </Flex>
          </Flex>
        }
        trigger={triggerElement}
        mainBtnTitle="Save"
        mainAction={handleSave}
        otherBtnTitle="Cancel"
      >
        <Box my="16px">
          <ListSelection
            result={contractLists}
            placeholder="Add to contract lists"
            helperText="Grouping your contracts by adding to your existing list or create
              a new list"
            setResult={(selectedList) => setContractLists(selectedList)}
            labelBgColor="gray.800"
          />
        </Box>
      </ActionModal>
    );
  }
);
