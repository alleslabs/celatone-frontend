import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import type { AxiosError } from "axios";
import type { KeyboardEvent } from "react";
import { useState } from "react";

import { CustomIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";
import {
  useExampleAddresses,
  useMobile,
  useValidateAddress,
} from "lib/app-provider";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useInstantiatedByMe } from "lib/model/contract";
import { useContractStore } from "lib/providers/store";
import { useContractData } from "lib/services/wasm/contract";
import type { BechAddr32, RpcQueryError } from "lib/types";

import { AllContractLists } from "./AllContractLists";
import { ContractListDetail } from "./ContractListDetail";

interface SelectContractInstantiatorProps {
  notSelected: boolean;
  onContractSelect: (contract: BechAddr32) => void;
}

export const SelectContractInstantiator = ({
  notSelected,
  onContractSelect,
}: SelectContractInstantiatorProps) => {
  const isMobile = useMobile();
  const { contract: exampleContractAddress } = useExampleAddresses();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { validateContractAddress } = useValidateAddress();

  const [listSlug, setListSlug] = useState("");
  const [searchContract, setSearchContract] = useState<BechAddr32>(
    "" as BechAddr32
  );
  const [invalid, setInvalid] = useState("");

  const { getContractLists } = useContractStore();

  // TODO - Revisit false case
  const { instantiatedListInfo, isLoading } = useInstantiatedByMe(true);
  const contractLists = [instantiatedListInfo, ...getContractLists()];
  const contractList = contractLists.find((item) => item.slug === listSlug);

  const resetOnClose = () => {
    setListSlug("");
    setSearchContract("" as BechAddr32);
    setInvalid("");
    onClose();
  };

  const onSelectThenClose = (contract: BechAddr32) => {
    track(AmpEvent.USE_CONTRACT_MODAL_LISTS);
    onContractSelect(contract);
    resetOnClose();
  };

  const { isFetching, isRefetching, refetch } = useContractData(
    searchContract,
    {
      cacheTime: 0,
      enabled: false,
      onError: (err) =>
        setInvalid(
          (err as AxiosError<RpcQueryError>).response?.data.message ||
            DEFAULT_RPC_ERROR
        ),
      onSuccess: () => onSelectThenClose(searchContract),
      refetchOnReconnect: false,
      retry: false,
    }
  );

  const handleListSelect = (slug: string) => {
    setListSlug(slug);
  };

  const handleSubmit = () => {
    const err = validateContractAddress(searchContract);
    if (err !== null) setInvalid(err);
    else {
      track(AmpEvent.USE_CONTRACT_MODAL_SEARCH);
      refetch();
    }
  };

  const handleKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      <Button
        px={4}
        py={1}
        size="sm"
        variant={notSelected ? "primary" : "outline-primary"}
        leftIcon={
          !notSelected ? <CustomIcon name="swap" boxSize="12px" /> : undefined
        }
        onClick={() => {
          track(AmpEvent.USE_CONTRACT_MODAL);
          onOpen();
        }}
      >
        {notSelected ? "Select Contract" : "Change Contract"}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement={isMobile ? "top" : "bottom"}
        onClose={resetOnClose}
      >
        <DrawerOverlay />
        <DrawerContent h={{ base: "auto", md: "80%" }}>
          {listSlug.length === 0 || !contractList ? (
            <>
              <DrawerHeader>
                <CustomIcon
                  name="contract-address"
                  boxSize={5}
                  color="gray.600"
                />
                <Heading as="h5" variant="h5">
                  Select Contract
                </Heading>
              </DrawerHeader>
              <DrawerCloseButton />

              <DrawerBody p={6} overflowY="scroll">
                <Heading as="h6" mb={4} variant="h6">
                  Fill contract address manually
                </Heading>
                <Flex alignItems="center" gap={2}>
                  <Input
                    isInvalid={invalid !== ""}
                    size="lg"
                    value={searchContract}
                    autoFocus
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setSearchContract(inputValue as BechAddr32);
                    }}
                    onKeyDown={handleKeydown}
                    placeholder={`ex. ${exampleContractAddress}`}
                  />
                  <Button
                    height="56px"
                    isDisabled={searchContract.length === 0}
                    minW="72px"
                    isLoading={isFetching || isRefetching}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Flex>
                <Text ml={3} mt={1} variant="body3" color="error.main">
                  {invalid}
                </Text>
                {!isMobile && (
                  <>
                    <Flex alignItems="center" gap={2} my={6}>
                      <Divider borderColor="gray.700" />
                      <Text variant="body1">OR</Text>
                      <Divider borderColor="gray.700" />
                    </Flex>

                    <Heading as="h6" mb={4} variant="h6">
                      Select from your Contract List
                    </Heading>
                    <AllContractLists
                      handleListSelect={handleListSelect}
                      isReadOnly
                      contractLists={contractLists}
                    />
                  </>
                )}
              </DrawerBody>
            </>
          ) : (
            <>
              <DrawerHeader>
                <CustomIcon
                  name="chevron-left"
                  boxSize={5}
                  color="gray.600"
                  cursor="pointer"
                  onClick={() => setListSlug("")}
                />
                <Heading as="h5" variant="h5">
                  {contractList.name}
                </Heading>
              </DrawerHeader>
              <DrawerCloseButton />
              <DrawerBody maxH="full" overflowY="scroll">
                <ContractListDetail
                  isReadOnly
                  contractListInfo={contractList}
                  isLoading={isLoading}
                  onContractSelect={onSelectThenClose}
                />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
