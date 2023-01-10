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
import type { LVPair } from "lib/types";

export interface OffchainDetail {
  name: string;
  description: string;
  tags: string[];
  lists: LVPair[];
}

interface OffChainFormProps<T extends OffchainDetail> {
  state: OffchainDetail;
  control: Control<T>;
  setTagsValue: (options: string[]) => void;
  setContractListsValue: (options: LVPair[]) => void;
  errors: Partial<FieldErrorsImpl<T>>;
  labelBgColor?: string;
}

export const OffChainForm = <T extends OffchainDetail>({
  state,
  control,
  setTagsValue,
  setContractListsValue,
  errors,
  labelBgColor = "background.main",
}: OffChainFormProps<T>) => {
  return (
    <VStack gap="16px" w="full">
      <ControllerInput
        name={"name" as FieldPath<T>}
        control={control}
        label="Name"
        helperText="Set name for your contract"
        variant="floating"
        rules={{
          maxLength: MAX_CONTRACT_NAME_LENGTH,
        }}
        error={errors.name && getMaxContractNameLengthError(state.name.length)}
        labelBgColor={labelBgColor}
      />
      <ControllerTextarea
        name={"description" as FieldPath<T>}
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
        labelBgColor={labelBgColor}
      />
      <TagSelection
        result={state.tags}
        setResult={setTagsValue}
        placeholder="Tags"
        helperText="Add tag to organize and manage your contracts"
        labelBgColor={labelBgColor}
      />
      <ListSelection
        result={state.lists}
        placeholder="Add to contract lists"
        helperText="Grouping your contracts by adding to your existing list or create
              a new list"
        setResult={setContractListsValue}
        labelBgColor={labelBgColor}
      />
    </VStack>
  );
};
