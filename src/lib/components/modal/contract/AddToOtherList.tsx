import { Box, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { ActionModal } from "../ActionModal";
import { AmpEvent, track } from "lib/amplitude";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ListSelection } from "lib/components/ListSelection";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
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
      actions: () => track(AmpEvent.CONTRACT_EDIT_LISTS),
      codeId: contractLocalInfo.codeId,
      contractAddress: contractLocalInfo.contractAddress,
      instantiator: contractLocalInfo.instantiator,
      label: contractLocalInfo.label,
      lists: contractLists,
      title: "Action Complete!",
    });

    useEffect(() => {
      setContractLists(
        contractLocalInfo.lists?.length ? contractLocalInfo.lists : []
      );
    }, [contractLocalInfo.lists]);

    return (
      <ActionModal
        mainBtnTitle="Save"
        title="Add or remove from lists"
        trigger={triggerElement}
        headerContent={
          <Flex gap={9} pt={6}>
            <Flex gap={2} direction="column">
              <Text variant="body2" color="text.dark" fontWeight={500}>
                Contract Name
              </Text>
              <Text variant="body2" color="text.dark" fontWeight={500}>
                Contract Address
              </Text>
            </Flex>

            <Flex gap={2} direction="column">
              <Text variant="body2">
                {contractLocalInfo.name ?? contractLocalInfo.label}
              </Text>
              <ExplorerLink
                fixedHeight
                type="contract_address"
                value={contractLocalInfo.contractAddress}
              />
            </Flex>
          </Flex>
        }
        icon="bookmark-solid"
        mainAction={handleSave}
        otherBtnTitle="Cancel"
      >
        <Box my={4}>
          <ListSelection
            helperText="Grouping your contracts by adding to your existing list or create
              a new list"
            result={contractLists}
            setResult={setContractLists}
            labelBgColor="gray.900"
            placeholder="Not listed"
          />
        </Box>
      </ActionModal>
    );
  }
);
