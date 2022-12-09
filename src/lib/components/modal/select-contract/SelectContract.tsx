import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Icon,
  Input,
  Flex,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { IoList } from "react-icons/io5";
import { MdChevronLeft } from "react-icons/md";

import { DEFAULT_RPC_ERROR } from "lib/data";
import { useContractStore, useEndpoint, useUserKey } from "lib/hooks";
import { useInstantiatedByMe } from "lib/model/contract";
import { queryContract } from "lib/services/contract";
import type { RpcContractError } from "lib/types";

import { AllContractLists } from "./AllContractLists";
import { ListDetail } from "./ListDetail";

interface SelectContractProps {
  notSelected: boolean;
  onContractSelect: (addr: string) => void;
}

export const SelectContract = ({
  notSelected,
  onContractSelect,
}: SelectContractProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [listSlug, setListSlug] = useState("");

  const [searchManual, setSearchManual] = useState("");
  const [searchList, setSearchList] = useState("");
  const [searchInList, setSearchInList] = useState("");
  const [invalid, setInvalid] = useState("");

  const userKey = useUserKey();
  const { getContractLists } = useContractStore();
  const contractLists = [
    useInstantiatedByMe(true),
    ...getContractLists(userKey),
  ];
  const contractList = contractLists.find((item) => item.slug === listSlug);

  const endpoint = useEndpoint();

  const resetOnClose = () => {
    setListSlug("");
    setSearchManual("");
    setSearchList("");
    setSearchInList("");
    setInvalid("");
    onClose();
  };

  const onSelectThenClose = (contract: string) => {
    onContractSelect(contract);
    resetOnClose();
  };

  // TODO: Abstract query
  const { refetch, isFetching, isRefetching } = useQuery(
    ["query", searchManual],
    async () => queryContract(endpoint, searchManual),
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      refetchOnReconnect: false,
      onSuccess() {
        onSelectThenClose(searchManual);
      },
      onError(err: AxiosError<RpcContractError>) {
        setInvalid(err.response?.data.error || DEFAULT_RPC_ERROR);
      },
    }
  );

  const handleListSelect = (slug: string) => {
    setListSlug(slug);
  };

  return (
    <>
      <Button
        variant={notSelected ? "primary" : "outline-info"}
        py="6px"
        px="16px"
        onClick={onOpen}
      >
        {notSelected ? "SELECT CONTRACT" : "CHANGE"}
      </Button>
      <Modal isOpen={isOpen} onClose={resetOnClose} size="4xl">
        <ModalOverlay />
        {listSlug.length === 0 || !contractList ? (
          <ModalContent>
            <ModalHeader>
              <Icon as={IoList} color="text.dark" fontSize="24px" />
              <Heading as="h5" variant="h5">
                Select Contract
              </Heading>
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody p="24px">
              <Heading as="h6" variant="h6" mb="8px">
                Fill contract address manually
              </Heading>
              <Flex gap="8px" alignItems="center">
                <Input
                  isInvalid={invalid !== ""}
                  value={searchManual}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setSearchManual(inputValue);
                  }}
                  placeholder="ex. terra1e2lv8v8qq98rtmxry209k4yl5ylk59d8nclgvqp6x3gvs6kpwe5q0p67q3"
                  size="md"
                />
                <Button
                  isDisabled={searchManual.length === 0}
                  isLoading={isFetching || isRefetching}
                  onClick={() => {
                    refetch();
                  }}
                >
                  Submit
                </Button>
              </Flex>
              <Text color="error.main"> {invalid} </Text>

              <Flex my="24px" gap="8px" alignItems="center">
                <Divider borderColor="gray.500" />
                <Text variant="body1">OR</Text>
                <Divider borderColor="gray.500" />
              </Flex>

              <Heading as="h6" variant="h6" mb="8px">
                Select from your Contract List
              </Heading>
              <AllContractLists
                search={searchList}
                setSearch={setSearchList}
                contractLists={contractLists}
                handleListSelect={handleListSelect}
                isReadOnly
                formLabelBgColor="gray.800"
              />
            </ModalBody>
          </ModalContent>
        ) : (
          <ModalContent>
            <ModalHeader>
              <Icon
                as={MdChevronLeft}
                color="text.dark"
                fontSize="24px"
                onClick={() => setListSlug("")}
                cursor="pointer"
              />
              <Heading as="h5" variant="h5">
                {contractList.name}
              </Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ListDetail
                search={searchInList}
                setSearch={setSearchInList}
                contractListInfo={contractList}
                isReadOnly
                isContractRemovable={
                  contractList.isContractRemovable
                    ? { label: contractList.name, value: contractList.slug }
                    : undefined
                }
                onContractSelect={onSelectThenClose}
              />
            </ModalBody>
          </ModalContent>
        )}
      </Modal>
    </>
  );
};
