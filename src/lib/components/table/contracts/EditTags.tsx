import { Flex, FormControl, Box, Text } from "@chakra-ui/react";
import { useState } from "react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { ActionModal } from "lib/components/modal";
import { TagSelection } from "lib/components/TagSelection";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { ContractLocalInfo } from "lib/stores/contract";
import { getTagsDefault } from "lib/utils";

interface EditTagsProps {
  contractLocalInfo: ContractLocalInfo;
}

export function EditTags({ contractLocalInfo }: EditTagsProps) {
  const [tagResult, setTagResult] = useState<string[]>(
    getTagsDefault(contractLocalInfo.tags)
  );
  const handleSave = useHandleContractSave({
    title: "Updated tags successfully!",
    contractAddress: contractLocalInfo.contractAddress,
    instantiator: contractLocalInfo.instantiator,
    label: contractLocalInfo.label,
    tags: tagResult,
    actions: () => AmpTrack(AmpEvent.CONTRACT_EDIT_TAGS),
  });

  return (
    <ActionModal
      title="Edit Tags"
      trigger={
        <CustomIcon
          cursor="pointer"
          name="edit"
          color="pebble.600"
          boxSize="3"
        />
      }
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
      mainBtnTitle="Save"
      mainAction={handleSave}
      otherBtnTitle="Cancel"
    >
      <FormControl>
        <Box my="24px">
          <TagSelection
            result={tagResult}
            placeholder="Tags"
            helperText="Add tag to organize and manage your contracts"
            setResult={(selectedOptions: string[]) => {
              setTagResult(selectedOptions);
            }}
            labelBgColor="pebble.900"
          />
        </Box>
      </FormControl>
    </ActionModal>
  );
}
