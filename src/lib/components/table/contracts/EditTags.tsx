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
      title="Edit tags"
      trigger={
        <CustomIcon cursor="pointer" name="edit" color="gray.600" boxSize={3} />
      }
      headerContent={
        <Flex pt={6} gap={9}>
          <Flex direction="column" gap={2}>
            <Text variant="body2" fontWeight={500} color="text.dark">
              Contract Name
            </Text>
            <Text variant="body2" fontWeight={500} color="text.dark">
              Contract Address
            </Text>
          </Flex>

          <Flex direction="column" gap={2}>
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
        <Box my={6}>
          <TagSelection
            result={tagResult}
            placeholder="Tags"
            helperText="Add tag to organize and manage your contracts"
            setResult={(selectedOptions: string[]) => {
              setTagResult(selectedOptions);
            }}
            labelBgColor="gray.900"
          />
        </Box>
      </FormControl>
    </ActionModal>
  );
}
