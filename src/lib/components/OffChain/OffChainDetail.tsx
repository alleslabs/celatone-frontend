import { VStack } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect } from "react";

import type { FormStatus } from "lib/components/forms";
import {
  ListSelection,
  TextInput,
  TagSelection,
  TextAreaInput,
} from "lib/components/forms";
import {
  getMaxContractDescriptionLengthError,
  getMaxContractNameLengthError,
  MAX_CONTRACT_DESCRIPTION_LENGTH,
  MAX_CONTRACT_NAME_LENGTH,
} from "lib/data";
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

  const [nameStatus, setNameStatus] = useState<FormStatus>({ state: "init" });
  const [descriptionStatus, setDescriptionStatus] = useState<FormStatus>({
    state: "init",
  });

  // TODO: apply useForm
  useEffect(() => {
    const trimedName = name.trim();
    if (trimedName.length === 0) {
      setNameStatus({ state: "init" });
    } else if (trimedName.length > MAX_CONTRACT_NAME_LENGTH)
      setNameStatus({
        state: "error",
        message: getMaxContractNameLengthError(trimedName.length),
      });
    else setNameStatus({ state: "success" });
  }, [name]);

  useEffect(() => {
    const trimedDescription = description.trim();
    if (trimedDescription.length === 0) {
      setDescriptionStatus({ state: "init" });
    } else if (trimedDescription.length > MAX_CONTRACT_DESCRIPTION_LENGTH)
      setDescriptionStatus({
        state: "error",
        message: getMaxContractDescriptionLengthError(trimedDescription.length),
      });
    else setDescriptionStatus({ state: "success" });
  }, [description]);

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
        status={nameStatus}
      />
      <TextAreaInput
        variant="floating"
        value={description}
        setInputState={setDescription}
        label="Description"
        labelBgColor="gray.800"
        helperText="Help understanding what this contract do and how it works"
        status={descriptionStatus}
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
