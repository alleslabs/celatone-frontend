import { VStack } from "@chakra-ui/react";
import type { Control, FieldErrorsImpl, FieldPath } from "react-hook-form";

import { useCelatoneApp } from "lib/app-provider";
import { useGetMaxLengthError } from "lib/hooks";
import type { LVPair } from "lib/types";

import { ControllerInput, ControllerTextarea } from "./forms";
import { ListSelection } from "./ListSelection";
import { TagSelection } from "./TagSelection";

export interface OffchainDetail {
  description: string;
  lists: LVPair[];
  name: string;
  tags: string[];
}

interface OffChainFormProps<T extends OffchainDetail> {
  contractLabel: string;
  control: Control<T>;
  errors: Partial<FieldErrorsImpl<T>>;
  labelBgColor?: string;
  setContractListsValue: (options: LVPair[]) => void;
  setTagsValue: (options: string[]) => void;
  state: OffchainDetail;
}

export const OffChainForm = <T extends OffchainDetail>({
  contractLabel,
  control,
  errors,
  labelBgColor = "background.main",
  setContractListsValue,
  setTagsValue,
  state,
}: OffChainFormProps<T>) => {
  const { constants } = useCelatoneApp();
  const getMaxLengthError = useGetMaxLengthError();

  return (
    <VStack gap={4} w="full">
      <ControllerInput
        helperText="Set name for your contract"
        label="Name"
        name={"name" as FieldPath<T>}
        rules={{
          maxLength: constants.maxContractNameLength,
        }}
        variant="fixed-floating"
        control={control}
        error={
          errors.name && getMaxLengthError(state.name.length, "contract_name")
        }
        labelBgColor={labelBgColor}
        placeholder={contractLabel}
      />
      <ControllerTextarea
        label="Description"
        name={"description" as FieldPath<T>}
        rules={{
          maxLength: constants.maxContractDescriptionLength,
        }}
        variant="fixed-floating"
        control={control}
        error={
          errors.description &&
          getMaxLengthError(state.description.length, "contract_desc")
        }
        labelBgColor={labelBgColor}
        placeholder="Help understanding what this contract does and how it works ..."
      />
      <TagSelection
        helperText="Add tag to organize and manage your contracts"
        result={state.tags}
        setResult={setTagsValue}
        labelBgColor={labelBgColor}
        placeholder="Select tags or create new ones"
      />
      <ListSelection
        helperText="Grouping your contracts by adding to your existing list or create
              a new list"
        result={state.lists}
        setResult={setContractListsValue}
        labelBgColor={labelBgColor}
        placeholder="Not listed"
      />
    </VStack>
  );
};
