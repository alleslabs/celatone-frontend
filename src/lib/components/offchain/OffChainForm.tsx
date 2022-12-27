import { VStack } from "@chakra-ui/react";
import type { Control, FieldErrorsImpl, FieldPath } from "react-hook-form";

import {
  ControllerInput,
  ListSelection,
  TagSelection,
  ControllerTextarea,
} from "lib/components/forms";
import {
  getMaxContractDescriptionLengthError,
  getMaxContractNameLengthError,
  MAX_CONTRACT_DESCRIPTION_LENGTH,
  MAX_CONTRACT_NAME_LENGTH,
} from "lib/data";
import { useContractStore, useUserKey } from "lib/hooks";
import type { Option } from "lib/types";

export interface OffchainDetail {
  name: string;
  description: string;
  tags: string[];
  lists: Option[];
}

interface OffChainFormProps<T extends OffchainDetail> {
  nameField: FieldPath<T>;
  descriptionField: FieldPath<T>;
  state: OffchainDetail;
  control: Control<T>;
  setTagsValue: (options: string[]) => void;
  setContractListsValue: (options: Option[]) => void;
  errors: Partial<FieldErrorsImpl<T>>;
}

export const OffChainForm = <T extends OffchainDetail>({
  nameField,
  descriptionField,
  state,
  control,
  setTagsValue,
  setContractListsValue,
  errors,
}: OffChainFormProps<T>) => {
  const userKey = useUserKey();
  const { getAllTags } = useContractStore();

  return (
    <VStack gap="16px" w="full">
      <ControllerInput
        name={nameField}
        control={control}
        label="Name"
        helperText="Set name for your contract"
        variant="floating"
        rules={{
          maxLength: MAX_CONTRACT_NAME_LENGTH,
        }}
        error={errors.name && getMaxContractNameLengthError(state.name.length)}
      />
      <ControllerTextarea
        name={descriptionField}
        control={control}
        label="Description"
        helperText="Help understanding what this contract do and how it works"
        variant="floating"
        rules={{
          maxLength: MAX_CONTRACT_DESCRIPTION_LENGTH,
        }}
        error={
          errors.description &&
          getMaxContractDescriptionLengthError(state.description.length)
        }
      />
      <TagSelection
        options={getAllTags(userKey)}
        result={state.tags}
        placeholder="Tags"
        helperText="Add tag to organize and manage your contracts"
        setResult={setTagsValue}
      />
      <ListSelection
        result={state.lists}
        placeholder="Add to contract lists"
        helperText="Grouping your contracts by adding to your existing list or create
              a new list"
        setResult={setContractListsValue}
      />
    </VStack>
  );
};
