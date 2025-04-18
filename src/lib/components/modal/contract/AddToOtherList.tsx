import { Box, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ListSelection } from "lib/components/ListSelection";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";
import { ActionModal } from "../ActionModal";

interface AddToOtherListModalProps {
  contractLocalInfo: ContractLocalInfo;
  triggerElement: JSX.Element;
}

export const AddToOtherListModal = observer(
  ({ contractLocalInfo, triggerElement }: AddToOtherListModalProps) => {
    const [contractLists, setContractLists] = useState<LVPair[]>([]);

    const handleSave = useHandleContractSave({
      title: "Action complete!",
      contractAddress: contractLocalInfo.contractAddress,
      label: contractLocalInfo.label,
      codeId: contractLocalInfo.codeId,
      instantiator: contractLocalInfo.instantiator,
      lists: contractLists,
      actions: () => track(AmpEvent.CONTRACT_EDIT_LISTS),
    });

    useEffect(() => {
      setContractLists(
        contractLocalInfo.lists?.length ? contractLocalInfo.lists : []
      );
    }, [contractLocalInfo.lists]);

    return (
      <ActionModal
        title="Add or remove from lists"
        icon="bookmark-solid"
        headerContent={
          <Flex pt={6} gap={9}>
            <Flex direction="column" gap={2}>
              <Text variant="body2" fontWeight={500} color="text.dark">
                Contract name
              </Text>
              <Text variant="body2" fontWeight={500} color="text.dark">
                Contract address
              </Text>
            </Flex>

            <Flex direction="column" gap={2}>
              <Text variant="body2">
                {contractLocalInfo.name ?? contractLocalInfo.label}
              </Text>
              <ExplorerLink
                fixedHeight
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
        <Box my={4}>
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
