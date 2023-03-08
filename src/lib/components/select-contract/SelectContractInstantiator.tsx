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
  Input,
  Flex,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";

import { CustomIcon } from "../icon";
import {
  useCelatoneApp,
  useLCDEndpoint,
  useValidateAddress,
} from "lib/app-provider";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useInstantiatedByMe } from "lib/model/contract";
import { useContractStore } from "lib/providers/store";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { queryContract } from "lib/services/contract";
import type { ContractAddr, RpcQueryError } from "lib/types";

import { AllContractLists } from "./AllContractLists";
import { ContractListDetail } from "./ContractListDetail";

interface SelectContractInstantiatorProps {
  notSelected: boolean;
  onContractSelect: (contract: ContractAddr) => void;
}

export const SelectContractInstantiator = ({
  notSelected,
  onContractSelect,
}: SelectContractInstantiatorProps) => {
  const {
    appContractAddress: { example: exampleContractAddress },
  } = useCelatoneApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [listSlug, setListSlug] = useState("");
  const { validateContractAddress } = useValidateAddress();

  const [searchContract, setSearchContract] = useState<ContractAddr>(
    "" as ContractAddr
  );
  const [invalid, setInvalid] = useState("");

  const { getContractLists } = useContractStore();

  // TODO - Revisit false case
  const contractLists = [
    useInstantiatedByMe(true).instantiatedListInfo,
    ...getContractLists(),
  ];
  const contractList = contractLists.find((item) => item.slug === listSlug);

  const endpoint = useLCDEndpoint();

  const resetOnClose = () => {
    setListSlug("");
    setSearchContract("" as ContractAddr);
    setInvalid("");
    onClose();
  };

  const onSelectThenClose = (contract: ContractAddr) => {
    AmpTrack(AmpEvent.USE_CONTRACT_MODAL_LISTS);
    onContractSelect(contract);
    resetOnClose();
  };

  // TODO: Abstract query
  const { refetch, isFetching, isRefetching } = useQuery(
    ["query", "contract", searchContract, endpoint],
    async () => queryContract(endpoint, searchContract as ContractAddr),
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      refetchOnReconnect: false,
      onSuccess() {
        onSelectThenClose(searchContract);
      },
      onError(err: AxiosError<RpcQueryError>) {
        setInvalid(err.response?.data.message || DEFAULT_RPC_ERROR);
      },
    }
  );

  const handleListSelect = (slug: string) => {
    setListSlug(slug);
  };

  return (
    <>
      <Button
        variant={notSelected ? "primary" : "outline-primary"}
        py="6px"
        size="sm"
        px="16px"
        onClick={() => {
          AmpTrack(AmpEvent.USE_CONTRACT_MODAL);
          onOpen();
        }}
        leftIcon={
          !notSelected ? (
            <CustomIcon name="swap" color="violet.light" />
          ) : undefined
        }
      >
        {notSelected ? "Select Contract" : "Change Contract"}
      </Button>
      <Modal isOpen={isOpen} onClose={resetOnClose} size="4xl" isCentered>
        <ModalOverlay />
        <ModalContent h="80%">
          {listSlug.length === 0 || !contractList ? (
            <>
              <ModalHeader>
                <CustomIcon name="contract-address-solid" boxSize="5" />
                <Heading as="h5" variant="h5">
                  Select Contract
                </Heading>
              </ModalHeader>
              <ModalCloseButton />

              <ModalBody p="24px" maxH="full" overflowY="scroll">
                <Heading as="h6" variant="h6" mb="8px">
                  Fill contract address manually
                </Heading>
                <Flex gap="8px" alignItems="center">
                  <Input
                    isInvalid={invalid !== ""}
                    value={searchContract}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setSearchContract(inputValue as ContractAddr);
                    }}
                    placeholder={`ex. ${exampleContractAddress}`}
                    size="md"
                  />
                  <Button
                    height="40px"
                    isDisabled={searchContract.length === 0}
                    isLoading={isFetching || isRefetching}
                    onClick={() => {
                      const err = validateContractAddress(searchContract);
                      if (err !== null) setInvalid(err);
                      else {
                        AmpTrack(AmpEvent.USE_CONTRACT_MODAL_SEARCH);
                        refetch();
                      }
                    }}
                  >
                    Submit
                  </Button>
                </Flex>
                <Text variant="body3" color="error.main" mt={1} ml={3}>
                  {invalid}
                </Text>

                <Flex my="24px" gap="8px" alignItems="center">
                  <Divider borderColor="pebble.700" />
                  <Text variant="body1">OR</Text>
                  <Divider borderColor="pebble.700" />
                </Flex>

                <Heading as="h6" variant="h6" mb={6}>
                  Select from your Contract List
                </Heading>
                <AllContractLists
                  contractLists={contractLists}
                  handleListSelect={handleListSelect}
                  isReadOnly
                  formLabelBgColor="pebble.900"
                />
              </ModalBody>
            </>
          ) : (
            <>
              <ModalHeader>
                <CustomIcon
                  name="chevron-left"
                  boxSize="5"
                  onClick={() => setListSlug("")}
                  cursor="pointer"
                />
                <Heading as="h5" variant="h5">
                  {contractList.name}
                </Heading>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody maxH="full" overflowY="scroll">
                <ContractListDetail
                  contractListInfo={contractList}
                  isReadOnly
                  onContractSelect={onSelectThenClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
