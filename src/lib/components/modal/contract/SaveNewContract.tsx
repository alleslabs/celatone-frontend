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
  contractAddress: string;
  label: string;
  codeId: number;
  instantiator: string;
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
    label: "",
    codeId: 0,
    instantiator: "",
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
  const labelState = watch("label");
  const codeIdState = watch("codeId");
  const instantiatorState = watch("instantiator");
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

  const { refetch } = useContractData(contractAddressState as BechAddr32, {
    enabled: false,
    onSuccess: (data) => {
      const contractLocalInfo = getContractLocalInfo(contractAddressState);
      reset({
        contractAddress: contractAddressState,
        label: data.contract.label,
        codeId: data.contract.codeId,
        instantiator: data.contract.instantiator,
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
        message: "Valid contract address",
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
    label: labelState,
    codeId: codeIdState,
    instantiator: instantiatorState as BechAddr,
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
      title="Save new contract"
      icon="bookmark-solid"
      trigger={<Button as="button" {...buttonProps} />}
      mainBtnTitle="Save"
      mainAction={handleSave}
      disabledMain={
        status.state !== "success" || !!errors.name || !!errors.description
      }
      icon="bookmark-solid"
      mainAction={handleSave}
      mainBtnTitle="Save"
      otherAction={resetForm}
      otherBtnTitle="Cancel"
      title="Save New Contract"
      trigger={<Button as="button" {...buttonProps} />}
    >
      <VStack gap={4}>
        <ControllerInput
          control={control}
          label="Contract address"
          variant="fixed-floating"
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
