import type { LVPair } from "lib/types";
import type { Control, FieldErrorsImpl, FieldPath } from "react-hook-form";

import { VStack } from "@chakra-ui/react";
import { useCelatoneApp } from "lib/app-provider";
import { useGetMaxLengthError } from "lib/hooks";

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
        control={control}
        error={
          errors.name && getMaxLengthError(state.name.length, "contract_name")
        }
        helperText="Set name for your contract"
        label="Name"
        labelBgColor={labelBgColor}
        name={"name" as FieldPath<T>}
        placeholder={contractLabel}
        rules={{
          maxLength: constants.maxContractNameLength,
        }}
        variant="fixed-floating"
      />
      <ControllerTextarea
        control={control}
        error={
          errors.description &&
          getMaxLengthError(state.description.length, "contract_desc")
        }
        label="Description"
        labelBgColor={labelBgColor}
        name={"description" as FieldPath<T>}
        placeholder="Help understanding what this contract does and how it works ..."
        rules={{
          maxLength: constants.maxContractDescriptionLength,
        }}
        variant="fixed-floating"
      />
      <TagSelection
        helperText="Add tag to organize and manage your contracts"
        labelBgColor={labelBgColor}
        placeholder="Select tags or create new ones"
        result={state.tags}
        setResult={setTagsValue}
      />
      <ListSelection
        helperText="Grouping your contracts by adding to your existing list or create
              a new list"
        labelBgColor={labelBgColor}
        placeholder="Not listed"
        result={state.lists}
        setResult={setContractListsValue}
      />
    </VStack>
  );
};
