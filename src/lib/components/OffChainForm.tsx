import { VStack } from "@chakra-ui/react";
import type { Control, FieldErrorsImpl, FieldPath } from "react-hook-form";

import { useCelatoneApp } from "lib/app-provider";
import { useGetMaxLengthError } from "lib/hooks";
import type { LVPair } from "lib/types";

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
  const getMaxLengthError = useGetMaxLengthError();

  return (
    <VStack gap={4} w="full">
      <ControllerInput
        name={"name" as FieldPath<T>}
        control={control}
        label="Name"
        placeholder={contractLabel}
        helperText="Set name for your contract"
        variant="fixed-floating"
        rules={{
          maxLength: constants.maxContractNameLength,
        }}
        error={
          errors.name && getMaxLengthError(state.name.length, "contract_name")
        }
        labelBgColor={labelBgColor}
      />
      <ControllerTextarea
        name={"description" as FieldPath<T>}
        control={control}
        label="Description"
        placeholder="Help understanding what this contract does and how it works ..."
        variant="fixed-floating"
        rules={{
          maxLength: constants.maxContractDescriptionLength,
        }}
        error={
          errors.description &&
          getMaxLengthError(state.description.length, "contract_desc")
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
