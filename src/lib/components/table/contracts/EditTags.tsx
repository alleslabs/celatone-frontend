import { Box, Flex, FormControl, Text } from "@chakra-ui/react";
import { useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { ActionModal } from "lib/components/modal";
import { TagSelection } from "lib/components/TagSelection";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
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
    actions: () => track(AmpEvent.CONTRACT_EDIT_TAGS),
    codeId: contractLocalInfo.codeId,
    contractAddress: contractLocalInfo.contractAddress,
    instantiator: contractLocalInfo.instantiator,
    label: contractLocalInfo.label,
    tags: tagResult,
    title: "Updated tags successfully!",
  });

  return (
    <ActionModal
      mainBtnTitle="Save"
      title="Edit Tags"
      trigger={
        <CustomIcon name="edit" boxSize={3} color="gray.600" cursor="pointer" />
      }
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
              type="contract_address"
              value={contractLocalInfo.contractAddress}
            />
          </Flex>
        </Flex>
      }
      mainAction={handleSave}
      otherBtnTitle="Cancel"
    >
      <FormControl>
        <Box my={6}>
          <TagSelection
            helperText="Add tag to organize and manage your contracts"
            result={tagResult}
            setResult={(selectedOptions: string[]) => {
              setTagResult(selectedOptions);
            }}
            labelBgColor="gray.900"
            placeholder="Tags"
          />
        </Box>
      </FormControl>
    </ActionModal>
  );
}
