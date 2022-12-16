import type { ButtonProps } from "@chakra-ui/react";
import { VStack, Button } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { MdBookmark } from "react-icons/md";

import type { FormStatus } from "lib/components/forms";
import { TextInput } from "lib/components/forms";
import { ActionModal } from "lib/components/modal/ActionModal";
import { OffChainDetail } from "lib/components/OffChain/OffChainDetail";
import {
  DEFAULT_RPC_ERROR,
  INSTANTIATED_LIST_NAME,
  MAX_CONTRACT_DESCRIPTION_LENGTH,
  MAX_CONTRACT_NAME_LENGTH,
} from "lib/data";
import { useContractStore, useEndpoint } from "lib/hooks";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import { queryContractWithTime } from "lib/services/contract";
import type { Option, RpcContractError } from "lib/types";
import { formatSlugName } from "lib/utils";

interface SaveNewContractProps {
  list: Option;
  buttonProps: ButtonProps;
}
export function SaveNewContract({ list, buttonProps }: SaveNewContractProps) {
  const initialList =
    list.value === formatSlugName(INSTANTIATED_LIST_NAME) ? [] : [list];

  const [contractAddress, setContractAddress] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [lists, setLists] = useState<Option[]>(initialList);

  const [instantiator, setInstantiator] = useState("");
  const [label, setLabel] = useState("");
  const [created, setCreated] = useState(new Date(0));

  const [status, setStatus] = useState<FormStatus>({ state: "init" });

  const endpoint = useEndpoint();

  const { getContractInfo } = useContractStore();

  const reset = (resetContractAddress = true) => {
    if (resetContractAddress) setContractAddress("");
    setName("");
    setTags([]);
    setLists(initialList);
    setInstantiator("");
    setCreated(new Date(0));
    setLabel("");
    setStatus({ state: "init" });
  };

  // TODO: Abstract query
  const { refetch } = useQuery(
    ["query", "contractWithTime", contractAddress],
    async () => queryContractWithTime(endpoint, contractAddress),
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      refetchOnReconnect: false,
      onSuccess(data) {
        setInstantiator(data.instantiator);
        setLabel(data.label);
        setCreated(data.created);
        setName(data.label);
        setStatus({
          state: "success",
          message: "Valid Contract Address",
        });
        const contractInfo = getContractInfo(contractAddress);
        if (contractInfo) {
          if (contractInfo.name) setName(contractInfo.name);
          if (contractInfo.description)
            setDescription(contractInfo.description);
          if (contractInfo.tags) setTags(contractInfo.tags);
          if (contractInfo.lists) {
            const filteredLists = contractInfo.lists.filter(
              (item) => item.value !== list.value
            );
            setLists([list, ...filteredLists]);
          }
        }
      },
      onError(err: AxiosError<RpcContractError>) {
        reset(false);
        setStatus({
          state: "error",
          message: err.response?.data.error || DEFAULT_RPC_ERROR,
        });
      },
    }
  );

  useEffect(() => {
    if (contractAddress.trim().length === 0) {
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
  }, [contractAddress, refetch]);

  const handleSave = useHandleContractSave({
    title: `Saved ${name.trim().length ? name : label}`,
    address: contractAddress,
    instantiator,
    label,
    created,
    name,
    description,
    tags,
    lists,
    actions: reset,
  });

  return (
    <ActionModal
      title="Save New Contract"
      icon={MdBookmark}
      trigger={<Button {...buttonProps} />}
      mainBtnTitle="Save"
      mainAction={handleSave}
      // TODO: apply use-react-form later
      disabledMain={
        status.state !== "success" ||
        name.trim().length > MAX_CONTRACT_NAME_LENGTH ||
        description.trim().length > MAX_CONTRACT_DESCRIPTION_LENGTH
      }
      otherBtnTitle="Cancel"
      otherAction={reset}
    >
      <VStack gap="16px">
        <TextInput
          variant="floating"
          value={contractAddress}
          setInputState={setContractAddress}
          label="Contract Address"
          labelBgColor="gray.800"
          helperText="ex. terra1ff1asdf7988aw49efa4vw9846789"
          status={status}
        />
        <TextInput
          variant="floating"
          value={instantiator}
          setInputState={setInstantiator}
          label="Instantiator"
          labelBgColor="gray.800"
          isDisabled
        />
        <OffChainDetail
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          tags={tags}
          setTags={setTags}
          lists={lists}
          setLists={setLists}
        />
      </VStack>
    </ActionModal>
  );
}
