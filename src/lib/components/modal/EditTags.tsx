import { Icon, Flex, FormControl, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { MdMode } from "react-icons/md";

import { ExplorerLink } from "../ExplorerLink";
import { TagSelection } from "lib/components/forms/TagSelection";
import { ActionModal } from "lib/components/modal/ActionModal";
import { useContractStore, useUserKey } from "lib/hooks";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractInfo } from "lib/stores/contract";

interface EditTagsProps {
  contractInfo: ContractInfo;
}

export function EditTags({ contractInfo }: EditTagsProps) {
  const userKey = useUserKey();
  const { getAllTags } = useContractStore();
  const [tagResult, setTagResult] = useState<string[]>(contractInfo.tags ?? []);
  const handleSave = useHandleContractSave({
    title: "Updated tags successfully!",
    contractAddress: contractInfo.contractAddress,
    instantiator: contractInfo.instantiator,
    label: contractInfo.label,
    created: contractInfo.created,
    tags: tagResult,
  });

  return (
    <ActionModal
      title="Edit Tags"
      trigger={
        <Icon as={MdMode} color="gray.600" boxSize="4" cursor="pointer" />
      }
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
      mainBtnTitle="Save"
      mainAction={handleSave}
      otherBtnTitle="Cancel"
    >
      <FormControl>
        <Box my="24px">
          <TagSelection
            options={getAllTags(userKey)}
            result={tagResult}
            placeholder="Tags"
            helperText="Add tag to organize and manage your contracts"
            setResult={(selectedOptions: string[]) => {
              setTagResult(selectedOptions);
            }}
          />
        </Box>
      </FormControl>
    </ActionModal>
  );
}
