import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";

import { Box, Flex, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ListSelection } from "lib/components/ListSelection";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import { observer } from "mobx-react-lite";
import { JSX } from "react";
import { useEffect, useState } from "react";

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
        headerContent={
          <Flex gap={9} pt={6}>
            <Flex direction="column" gap={2}>
              <Text color="text.dark" fontWeight={500} variant="body2">
                Contract name
              </Text>
              <Text color="text.dark" fontWeight={500} variant="body2">
                Contract address
              </Text>
            </Flex>

            <Flex direction="column" gap={2}>
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
        mainBtnTitle="Save"
        otherBtnTitle="Cancel"
        title="Add or remove from lists"
        trigger={triggerElement}
      >
        <Box my={4}>
          <ListSelection
            helperText="Grouping your contracts by adding to your existing list or create
              a new list"
            labelBgColor="gray.900"
            placeholder="Not listed"
            result={contractLists}
            setResult={setContractLists}
          />
        </Box>
      </ActionModal>
    );
  }
);
