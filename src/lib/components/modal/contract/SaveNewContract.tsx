import type { ButtonProps } from "@chakra-ui/react";
import { VStack, Button } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdBookmark } from "react-icons/md";

import { useCelatoneApp } from "lib/app-provider";
import type { FormStatus } from "lib/components/forms";
import { ControllerInput } from "lib/components/forms";
import { ActionModal } from "lib/components/modal/ActionModal";
import type { OffchainDetail } from "lib/components/offchain/OffChainForm";
import { OffChainForm } from "lib/components/offchain/OffChainForm";
import { DEFAULT_RPC_ERROR, INSTANTIATED_LIST_NAME } from "lib/data";
import { useContractStore, useEndpoint } from "lib/hooks";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import { queryInstantiateInfo } from "lib/services/contract";
import type { ContractAddr, Option, RpcContractError } from "lib/types";
import { formatSlugName } from "lib/utils";

interface SaveNewContractDetail extends OffchainDetail {
  contractAddress: string;
  instantiator: string;
  label: string;
  created: Date;
}

interface SaveNewContractProps {
  list: Option;
  buttonProps: ButtonProps;
}
export function SaveNewContract({ list, buttonProps }: SaveNewContractProps) {
  const endpoint = useEndpoint();
  const { getContractInfo } = useContractStore();

  const {
    appContractAddress: { example: exampleContractAddress },
  } = useCelatoneApp();
  const initialList =
    list.value === formatSlugName(INSTANTIATED_LIST_NAME) ? [] : [list];

  const defaultValues: SaveNewContractDetail = {
    contractAddress: "",
    instantiator: "",
    label: "",
    created: new Date(0),
    name: "",
    description: "",
    tags: [],
    lists: initialList,
  };

  const {
    control,
    setValue,
    watch,
    getValues,
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
  const createdState = watch("created");
  const offchainState: OffchainDetail = {
    name: watch("name"),
    description: watch("description"),
    tags: watch("tags"),
    lists: watch("lists"),
  };
  const setTagsValue = (selectedOptions: string[]) => {
    setValue("tags", selectedOptions);
  };
  const setContractListsValue = (selectedOptions: Option[]) => {
    setValue("lists", selectedOptions);
  };

  const resetForm = (resetContractAddress = true) => {
    reset({
      ...defaultValues,
      contractAddress: resetContractAddress ? "" : getValues().contractAddress,
    });
  };

  // TODO: Abstract query
  const { refetch } = useQuery(
    ["query", "instantiateInfo", contractAddressState],
    async () =>
      queryInstantiateInfo(endpoint, contractAddressState as ContractAddr),
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      refetchOnReconnect: false,
      onSuccess(data) {
        const contractInfo = getContractInfo(contractAddressState);
        reset({
          instantiator: data.instantiator,
          label: data.label,
          created: data.createdTime,
          name: contractInfo?.name ?? data.label,
          description: contractInfo?.description,
          tags: contractInfo?.tags,
          lists: [
            list,
            ...(contractInfo?.lists ?? []).filter(
              (item) => item.value !== list.value
            ),
          ],
        });
        setStatus({
          state: "success",
          message: "Valid Contract Address",
        });
      },
      onError(err: AxiosError<RpcContractError>) {
        resetForm(false);
        setStatus({
          state: "error",
          message: err.response?.data.error || DEFAULT_RPC_ERROR,
        });
      },
    }
  );

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
        refetch();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [contractAddressState, refetch]);

  const handleSave = useHandleContractSave({
    title: `Saved ${
      offchainState.name.trim().length ? offchainState.name : labelState
    }`,
    contractAddress: contractAddressState as ContractAddr,
    instantiator: instantiatorState,
    label: labelState,
    created: createdState,
    name: offchainState.name,
    description: offchainState.description,
    tags: offchainState.tags,
    lists: offchainState.lists,
    actions: resetForm,
  });

  return (
    <ActionModal
      title="Save New Contract"
      icon={MdBookmark}
      trigger={<Button {...buttonProps} />}
      mainBtnTitle="Save"
      mainAction={handleSave}
      disabledMain={
        status.state !== "success" || !!errors.name || !!errors.description
      }
      otherBtnTitle="Cancel"
      otherAction={reset}
    >
      <VStack gap="16px">
        <ControllerInput
          name="contractAddress"
          control={control}
          label="Contract Address"
          variant="floating"
          helperText={`ex. ${exampleContractAddress}`}
          status={status}
        />
        <ControllerInput
          name="instantiator"
          control={control}
          label="Instantiator"
          variant="floating"
          isDisabled
        />

        <OffChainForm
          nameField="name"
          descriptionField="description"
          state={offchainState}
          control={control}
          setTagsValue={setTagsValue}
          setContractListsValue={setContractListsValue}
          errors={errors}
        />
      </VStack>
    </ActionModal>
  );
}
