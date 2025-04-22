import type { ButtonProps } from "@chakra-ui/react";
import type { FormStatus } from "lib/components/forms";
import type { OffchainDetail } from "lib/components/OffChainForm";
import type { BechAddr, BechAddr32, LVPair } from "lib/types";

import { Button, VStack } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useExampleAddresses, useValidateAddress } from "lib/app-provider";
import { ControllerInput } from "lib/components/forms";
import { OffChainForm } from "lib/components/OffChainForm";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useHandleContractSave } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { useContractData } from "lib/services/wasm/contract";
import {
  formatSlugName,
  getNameAndDescriptionDefault,
  getTagsDefault,
} from "lib/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ActionModal } from "../ActionModal";

interface SaveNewContractDetail extends OffchainDetail {
  codeId: number;
  contractAddress: string;
  instantiator: string;
  label: string;
}

interface SaveNewContractModalProps {
  buttonProps: ButtonProps;
  list: LVPair;
}
export function SaveNewContractModal({
  buttonProps,
  list,
}: SaveNewContractModalProps) {
  const { getContractLocalInfo } = useContractStore();
  const { validateContractAddress } = useValidateAddress();

  const { contract: exampleContractAddress } = useExampleAddresses();
  const initialList =
    list.value === formatSlugName(INSTANTIATED_LIST_NAME) ? [] : [list];

  const defaultValues: SaveNewContractDetail = {
    codeId: 0,
    contractAddress: "",
    description: "",
    instantiator: "",
    label: "",
    lists: initialList,
    name: "",
    tags: [],
  };

  const {
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SaveNewContractDetail>({
    defaultValues,
    mode: "all",
  });

  const [status, setStatus] = useState<FormStatus>({ state: "init" });

  const contractAddressState = watch("contractAddress");
  const labelState = watch("label");
  const codeIdState = watch("codeId");
  const instantiatorState = watch("instantiator");
  const offchainState: OffchainDetail = {
    description: watch("description"),
    lists: watch("lists"),
    name: watch("name"),
    tags: watch("tags"),
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

  const { refetch } = useContractData(contractAddressState as BechAddr32, {
    enabled: false,
    onError: (err) => {
      resetForm(false);
      setStatus({
        message: (err as Error).message,
        state: "error",
      });
    },
    onSuccess: (data) => {
      const contractLocalInfo = getContractLocalInfo(contractAddressState);
      reset({
        codeId: data.contract.codeId,
        contractAddress: contractAddressState,
        description: getNameAndDescriptionDefault(
          contractLocalInfo?.description
        ),
        instantiator: data.contract.instantiator,
        label: data.contract.label,
        lists: [
          ...initialList,
          ...(contractLocalInfo?.lists ?? []).filter(
            (item) => item.value !== list.value
          ),
        ],
        name: contractLocalInfo?.name ?? data.contract.label,
        tags: getTagsDefault(contractLocalInfo?.tags),
      });
      setStatus({
        message: "Valid contract address",
        state: "success",
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
            message: err,
            state: "error",
          });
        else refetch();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [contractAddressState, refetch, validateContractAddress]);

  const handleSave = useHandleContractSave({
    actions: () => {
      track(AmpEvent.CONTRACT_SAVE);
      resetForm();
    },
    codeId: codeIdState,
    contractAddress: contractAddressState as BechAddr32,
    description: offchainState.description,
    instantiator: instantiatorState as BechAddr,
    label: labelState,
    lists: offchainState.lists,
    name: offchainState.name,
    tags: offchainState.tags,
    title: `Saved ${
      offchainState.name.trim().length ? offchainState.name : labelState
    }`,
  });

  return (
    <ActionModal
      disabledMain={
        status.state !== "success" || !!errors.name || !!errors.description
      }
      icon="bookmark-solid"
      mainAction={handleSave}
      mainBtnTitle="Save"
      otherAction={resetForm}
      otherBtnTitle="Cancel"
      title="Save new contract"
      trigger={<Button as="button" {...buttonProps} />}
    >
      <VStack gap={4}>
        <ControllerInput
          control={control}
          label="Contract address"
          labelBgColor="gray.900"
          name="contractAddress"
          placeholder={`ex. ${exampleContractAddress}`}
          status={status}
          variant="fixed-floating"
        />
        <ControllerInput
          control={control}
          isDisabled
          label="Instantiated by"
          labelBgColor="gray.900"
          name="instantiator"
          variant="fixed-floating"
        />

        <OffChainForm<SaveNewContractDetail>
          contractLabel={labelState}
          control={control}
          errors={errors}
          labelBgColor="gray.900"
          setContractListsValue={setContractListsValue}
          setTagsValue={setTagsValue}
          state={offchainState}
        />
      </VStack>
    </ActionModal>
  );
}
