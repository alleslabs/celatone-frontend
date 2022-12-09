import { VStack } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import {
  ListSelection,
  TextInput,
  TagSelection,
  TextAreaInput,
} from "lib/components/forms";
import { useContractStore, useUserKey } from "lib/hooks";
import type { Option } from "lib/types";

interface OffChainDetailProps {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  lists: Option[];
  setLists: Dispatch<SetStateAction<Option[]>>;
}

export const OffChainDetail = ({
  name,
  setName,
  description,
  setDescription,
  tags,
  setTags,
  lists,
  setLists,
}: OffChainDetailProps) => {
  const userKey = useUserKey();
  const { getAllTags } = useContractStore();

  return (
    <VStack gap="16px" w="full">
      <TextInput
        variant="floating"
        value={name}
        setInputState={setName}
        label="Name"
        labelBgColor="gray.800"
        helperText="Set name for your contract"
        size="md"
      />
      <TextAreaInput
        variant="floating"
        value={description}
        setInputState={setDescription}
        label="Description"
        labelBgColor="gray.800"
        helperText="Help understanding what this contract do and how it works"
      />
      <TagSelection
        options={getAllTags(userKey)}
        result={tags}
        placeholder="Tags"
        helperText="Add tag to organize and manage your contracts"
        setResult={(selectedOptions: string[]) => {
          setTags(selectedOptions);
        }}
      />
      <ListSelection
        result={lists}
        placeholder="Add to contract lists"
        helperText="Grouping your contracts by adding to your existing list or create
      a new list"
        setResult={(selectedOptions: Option[]) => {
          setLists(selectedOptions);
        }}
      />
    </VStack>
  );
};
