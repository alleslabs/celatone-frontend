import type { ContractLocalInfo } from "lib/stores/contract";

import { Box, Flex, FormControl, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { ActionModal } from "lib/components/modal";
import { TagSelection } from "lib/components/TagSelection";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import { getTagsDefault } from "lib/utils";
import { useState } from "react";

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
    label: contractLocalInfo.label,
    codeId: contractLocalInfo.codeId,
    instantiator: contractLocalInfo.instantiator,
    tags: tagResult,
    actions: () => track(AmpEvent.CONTRACT_EDIT_TAGS),
  });

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
              type="contract_address"
              value={contractLocalInfo.contractAddress}
            />
          </Flex>
        </Flex>
      }
      mainAction={handleSave}
      mainBtnTitle="Save"
      otherBtnTitle="Cancel"
      title="Edit tags"
      title="Edit Tags"
      trigger={
        <CustomIcon boxSize={3} color="gray.600" cursor="pointer" name="edit" />
      }
      trigger={
        <CustomIcon boxSize={3} color="gray.600" cursor="pointer" name="edit" />
      }
    >
      <FormControl>
        <Box my={6}>
          <TagSelection
            helperText="Add tag to organize and manage your contracts"
            labelBgColor="gray.900"
            placeholder="Tags"
            result={tagResult}
            setResult={(selectedOptions: string[]) => {
              setTagResult(selectedOptions);
            }}
          />
        </Box>
      </FormControl>
    </ActionModal>
  );
}
