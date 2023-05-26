import { VStack } from "@chakra-ui/react";
import type { Control, FieldErrorsImpl, FieldPath } from "react-hook-form";

import { useCelatoneApp } from "lib/app-provider";
import type { LVPair } from "lib/types";
import { getMaxLengthError } from "lib/utils";

import { ControllerInput, ControllerTextarea } from "./forms";
import { ListSelection } from "./ListSelection";
import { TagSelection } from "./TagSelection";

export interface OffchainDetail {
  name: string;
  description: string;
  tags: string[];
  lists: LVPair[];
}

interface OffChainFormProps<T extends OffchainDetail> {
  state: OffchainDetail;
  contractLabel: string;
  control: Control<T>;
  setTagsValue: (options: string[]) => void;
  setContractListsValue: (options: LVPair[]) => void;
  errors: Partial<FieldErrorsImpl<T>>;
  labelBgColor?: string;
}

export const OffChainForm = <T extends OffchainDetail>({
  state,
  contractLabel,
  control,
  setTagsValue,
  setContractListsValue,
  errors,
  labelBgColor = "background.main",
}: OffChainFormProps<T>) => {
  const { constants } = useCelatoneApp();

  return (
    <VStack gap="16px" w="full">
      <ControllerInput
        name={"name" as FieldPath<T>}
        control={control}
        label="Name"
        placeholder={contractLabel}
        helperText="Set name for your contract"
        variant="floating"
        rules={{
          maxLength: constants.maxContractNameLength,
        }}
        error={
          errors.name &&
          getMaxLengthError(
            "Contract name",
            state.name.length,
            constants.maxContractNameLength
          )
        }
        labelBgColor={labelBgColor}
      />
      <ControllerTextarea
        name={"description" as FieldPath<T>}
        control={control}
        label="Description"
        placeholder="Help understanding what this contract do and how it works ..."
        variant="floating"
        rules={{
          maxLength: constants.maxContractDescriptionLength,
        }}
        error={
          errors.description &&
          getMaxLengthError(
            "Contract description",
            state.description.length,
            constants.maxContractDescriptionLength
          )
        }
        labelBgColor={labelBgColor}
      />
      <TagSelection
        result={state.tags}
        setResult={setTagsValue}
        placeholder="Select tags or create new ones"
        helperText="Add tag to organize and manage your contracts"
        labelBgColor={labelBgColor}
      />
      <ListSelection
        result={state.lists}
        placeholder="Not listed"
        helperText="Grouping your contracts by adding to your existing list or create
              a new list"
        setResult={setContractListsValue}
        labelBgColor={labelBgColor}
      />
    </VStack>
  );
};
