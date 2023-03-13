import type { ButtonProps } from "@chakra-ui/react";
import { VStack, Button } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { ActionModal } from "../ActionModal";
import {
  useCelatoneApp,
  useLCDEndpoint,
  useValidateAddress,
} from "lib/app-provider";
import type { FormStatus } from "lib/components/forms";
import { ControllerInput } from "lib/components/forms";
import type { OffchainDetail } from "lib/components/OffChainForm";
import { OffChainForm } from "lib/components/OffChainForm";
import { DEFAULT_RPC_ERROR, INSTANTIATED_LIST_NAME } from "lib/data";
import { useHandleContractSave } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { queryInstantiateInfo } from "lib/services/contract";
import type { Addr, ContractAddr, LVPair, RpcQueryError } from "lib/types";
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
  const endpoint = useLCDEndpoint();
  const { indexerGraphClient } = useCelatoneApp();
  const { getContractLocalInfo } = useContractStore();
  const { validateContractAddress } = useValidateAddress();

  const {
    appContractAddress: { example: exampleContractAddress },
  } = useCelatoneApp();
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

  // TODO: Abstract query
  const { refetch } = useQuery(
    ["query", "instantiate_info", endpoint, contractAddressState],
    async () =>
      queryInstantiateInfo(
        endpoint,
        indexerGraphClient,
        contractAddressState as ContractAddr
      ),
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      refetchOnReconnect: false,
      onSuccess(data) {
        const contractLocalInfo = getContractLocalInfo(contractAddressState);
        reset({
          contractAddress: contractAddressState,
          instantiator: data.instantiator,
          label: data.label,
          name: contractLocalInfo?.name ?? data.label,
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
      onError(err: AxiosError<RpcQueryError>) {
        resetForm(false);
        setStatus({
          state: "error",
          message: err.response?.data.message || DEFAULT_RPC_ERROR,
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
    contractAddress: contractAddressState as ContractAddr,
    instantiator: instantiatorState as Addr,
    label: labelState,
    name: offchainState.name,
    description: offchainState.description,
    tags: offchainState.tags,
    lists: offchainState.lists,
    actions: () => {
      AmpTrack(AmpEvent.CONTRACT_SAVE);
      resetForm();
    },
  });

  return (
    <ActionModal
      title="Save New Contract"
      icon="bookmark-solid"
      trigger={<Button {...buttonProps} />}
      mainBtnTitle="Save"
      mainAction={handleSave}
      disabledMain={
        status.state !== "success" || !!errors.name || !!errors.description
      }
      otherBtnTitle="Cancel"
      otherAction={resetForm}
      closeOnOverlayClick={false}
    >
      <VStack gap="16px">
        <ControllerInput
          name="contractAddress"
          control={control}
          label="Contract Address"
          variant="floating"
          placeholder={`ex. ${exampleContractAddress}`}
          status={status}
          labelBgColor="pebble.900"
        />
        <ControllerInput
          name="instantiator"
          control={control}
          label="Instantiated by"
          variant="floating"
          isDisabled
          labelBgColor="pebble.900"
        />

        <OffChainForm<SaveNewContractDetail>
          state={offchainState}
          contractLabel={labelState}
          control={control}
          setTagsValue={setTagsValue}
          setContractListsValue={setContractListsValue}
          errors={errors}
          labelBgColor="pebble.900"
        />
      </VStack>
    </ActionModal>
  );
}
