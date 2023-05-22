import { Flex, Text, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { ActionModal } from "../ActionModal";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ListSelection } from "lib/components/ListSelection";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";

interface AddToOtherListModalProps {
  contractLocalInfo: ContractLocalInfo;
  triggerElement: JSX.Element;
}

export const AddToOtherListModal = observer(
  ({ contractLocalInfo, triggerElement }: AddToOtherListModalProps) => {
    const [contractLists, setContractLists] = useState<LVPair[]>([]);

    const handleSave = useHandleContractSave({
      title: "Action Complete!",
      contractAddress: contractLocalInfo.contractAddress,
      instantiator: contractLocalInfo.instantiator,
      label: contractLocalInfo.label,
      lists: contractLists,
      actions: () => AmpTrack(AmpEvent.CONTRACT_EDIT_LISTS),
    });

    useEffect(() => {
      setContractLists(
        contractLocalInfo.lists?.length ? contractLocalInfo.lists : []
      );
    }, [contractLocalInfo.lists]);

    return (
      <ActionModal
        title="Add or remove from other lists"
        icon="bookmark-solid"
        headerContent={
          <Flex pt="6" gap="36px">
            <Flex direction="column" gap="8px">
              <Text variant="body2" fontWeight="600">
                Contract Name
              </Text>
              <Text variant="body2" fontWeight="600">
                Contract Address
              </Text>
            </Flex>

            <Flex direction="column" gap="8px">
              <Text variant="body2">
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
            placeholder="Not listed"
            helperText="Grouping your contracts by adding to your existing list or create
              a new list"
            setResult={setContractLists}
            labelBgColor="gray.900"
          />
        </Box>
      </ActionModal>
    );
  }
);
