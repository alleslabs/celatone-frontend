import { Flex, Text, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdBookmark } from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { ListSelection } from "lib/components/forms/ListSelection";
import { ActionModal } from "lib/components/modal/ActionModal";
import type { OffchainDetail } from "lib/components/OffChainForm";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";

interface AddToOtherListProps {
  contractInfo: ContractInfo;
  triggerElement: JSX.Element;
}

export const AddToOtherList = observer(
  ({ contractInfo, triggerElement }: AddToOtherListProps) => {
    const { setValue, watch } = useForm<OffchainDetail>({
      mode: "all",
    });

    const setContractListsValue = useCallback(
      (selectedLists: LVPair[]) => {
        setValue("lists", selectedLists);
      },
      [setValue]
    );

    useEffect(() => {
      setContractListsValue(contractInfo.lists ?? []);
    }, [contractInfo.lists, setContractListsValue]);

    const offchainState = watch();

    const handleSave = useHandleContractSave({
      title: "Action complete!",
      contractAddress: contractInfo.contractAddress,
      instantiator: contractInfo.instantiator,
      label: contractInfo.label,
      created: contractInfo.created,
      lists: offchainState.lists,
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
        trigger={triggerElement}
        mainBtnTitle="Save"
        mainAction={handleSave}
        otherBtnTitle="Cancel"
      >
        <Box my="16px">
          <ListSelection
            result={offchainState.lists}
            placeholder="Add to contract lists"
            helperText="Grouping your contracts by adding to your existing list or create
              a new list"
            setResult={setContractListsValue}
            labelBgColor="gray.800"
          />
        </Box>
      </ActionModal>
    );
  }
);
