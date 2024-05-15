import type { ButtonProps } from "@chakra-ui/react";
import { Button, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ActionModal } from "../ActionModal";
import { AmpEvent, track } from "lib/amplitude";
import { useExampleAddresses, useValidateAddress } from "lib/app-provider";
import type { FormStatus } from "lib/components/forms";
import { ControllerInput } from "lib/components/forms";
import type { OffchainDetail } from "lib/components/OffChainForm";
import { OffChainForm } from "lib/components/OffChainForm";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useHandleContractSave } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { useContractLcd } from "lib/services/wasm/contract";
import type { BechAddr, BechAddr32, LVPair } from "lib/types";
import {
  formatSlugName,
  getNameAndDescriptionDefault,
  getTagsDefault,
} from "lib/utils";

interface SaveNewContractDetail extends OffchainDetail {
  contractAddress: string;
  instantiator: string;
  label: string;
}

interface SaveNewContractModalProps {
  list: LVPair;
  buttonProps: ButtonProps;
}
export function SaveNewContractModal({
  list,
  buttonProps,
}: SaveNewContractModalProps) {
  const { getContractLocalInfo } = useContractStore();
  const { validateContractAddress } = useValidateAddress();

  const { contract: exampleContractAddress } = useExampleAddresses();
  const initialList =
    list.value === formatSlugName(INSTANTIATED_LIST_NAME) ? [] : [list];

  const defaultValues: SaveNewContractDetail = {
    contractAddress: "",
    instantiator: "",
    label: "",
    name: "",
    description: "",
    tags: [],
    lists: initialList,
  };

  const {
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SaveNewContractDetail>({
    defaultValues,
    mode: "all",
  });

  const [status, setStatus] = useState<FormStatus>({ state: "init" });

  const contractAddressState = watch("contractAddress");
  const instantiatorState = watch("instantiator");
  const labelState = watch("label");
  const offchainState: OffchainDetail = {
    name: watch("name"),
    description: watch("description"),
    tags: watch("tags"),
    lists: watch("lists"),
  };
  const setTagsValue = (selecteTags: string[]) => {
    setValue("tags", selecteTags);
  };
  const setContractListsValue = (selectedLists: LVPair[]) => {
    setValue("lists", selectedLists);
  };

  const resetForm = (resetContractAddress = true) => {
    reset({
      ...defaultValues,
      contractAddress: resetContractAddress ? "" : contractAddressState,
    });
  };

  const { refetch } = useContractLcd(contractAddressState as BechAddr32, {
    onSuccess: (data) => {
      const contractLocalInfo = getContractLocalInfo(contractAddressState);
      reset({
        contractAddress: contractAddressState,
        instantiator: data.contract.instantiator,
        label: data.contract.label,
        name: contractLocalInfo?.name ?? data.contract.label,
        description: getNameAndDescriptionDefault(
          contractLocalInfo?.description
        ),
        tags: getTagsDefault(contractLocalInfo?.tags),
        lists: [
          ...initialList,
          ...(contractLocalInfo?.lists ?? []).filter(
            (item) => item.value !== list.value
          ),
        ],
      });
      setStatus({
        state: "success",
        message: "Valid Contract Address",
      });
    },
    onError: (err) => {
      resetForm(false);
      setStatus({
        state: "error",
        message: (err as Error).message,
      });
    },
  });

  useEffect(() => {
    if (contractAddressState.trim().length === 0) {
      setStatus({
        state: "init",
      });
    } else {
      setStatus({
        state: "loading",
      });
      const timeoutId = setTimeout(() => {
        const err = validateContractAddress(contractAddressState);
        if (err !== null)
          setStatus({
            state: "error",
            message: err,
          });
        else refetch();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [contractAddressState, refetch, validateContractAddress]);

  const handleSave = useHandleContractSave({
    title: `Saved ${
      offchainState.name.trim().length ? offchainState.name : labelState
    }`,
    contractAddress: contractAddressState as BechAddr32,
    instantiator: instantiatorState as BechAddr,
    label: labelState,
    name: offchainState.name,
    description: offchainState.description,
    tags: offchainState.tags,
    lists: offchainState.lists,
    actions: () => {
      track(AmpEvent.CONTRACT_SAVE);
      resetForm();
    },
  });

  return (
    <ActionModal
      title="Save New Contract"
      icon="bookmark-solid"
      trigger={<Button as="button" {...buttonProps} />}
      mainBtnTitle="Save"
      mainAction={handleSave}
      disabledMain={
        status.state !== "success" || !!errors.name || !!errors.description
      }
      otherBtnTitle="Cancel"
      otherAction={resetForm}
    >
      <VStack gap={4}>
        <ControllerInput
          name="contractAddress"
          control={control}
          label="Contract Address"
          variant="fixed-floating"
          placeholder={`ex. ${exampleContractAddress}`}
          status={status}
          labelBgColor="gray.900"
        />
        <ControllerInput
          name="instantiator"
          control={control}
          label="Instantiated by"
          variant="fixed-floating"
          isDisabled
          labelBgColor="gray.900"
        />

        <OffChainForm<SaveNewContractDetail>
          state={offchainState}
          contractLabel={labelState}
          control={control}
          setTagsValue={setTagsValue}
          setContractListsValue={setContractListsValue}
          errors={errors}
          labelBgColor="gray.900"
        />
      </VStack>
    </ActionModal>
  );
}
