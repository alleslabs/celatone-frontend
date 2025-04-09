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
import { CustomIcon } from "../icon";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const { refetch, isFetching, isRefetching } = useContractData(
    searchContract,
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      refetchOnReconnect: false,
      onSuccess: () => onSelectThenClose(searchContract),
      onError: (err) =>
        setInvalid(
          (err as AxiosError<RpcQueryError>).response?.data.message ||
            DEFAULT_RPC_ERROR
        ),
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
        variant={notSelected ? "primary" : "outline-primary"}
        py={1}
        size="sm"
        px={4}
        onClick={() => {
          track(AmpEvent.USE_CONTRACT_MODAL);
          onOpen();
        }}
        leftIcon={
          !notSelected ? <CustomIcon name="swap" boxSize="12px" /> : undefined
        }
      >
        {notSelected ? "Select contract" : "Change contract"}
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={resetOnClose}
        placement={isMobile ? "top" : "bottom"}
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
                  Select contract
                </Heading>
              </DrawerHeader>
              <DrawerCloseButton />

              <DrawerBody p={6} overflowY="scroll">
                <Heading as="h6" variant="h6" mb={4}>
                  Fill contract address manually
                </Heading>
                <Flex gap={2} alignItems="center">
                  <Input
                    isInvalid={invalid !== ""}
                    value={searchContract}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setSearchContract(inputValue as BechAddr32);
                    }}
                    placeholder={`ex. ${exampleContractAddress}`}
                    size="lg"
                    autoFocus
                    onKeyDown={handleKeydown}
                  />
                  <Button
                    height="56px"
                    minW="72px"
                    isDisabled={searchContract.length === 0}
                    isLoading={isFetching || isRefetching}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Flex>
                <Text variant="body3" color="error.main" mt={1} ml={3}>
                  {invalid}
                </Text>
                {!isMobile && (
                  <>
                    <Flex my={6} gap={2} alignItems="center">
                      <Divider borderColor="gray.700" />
                      <Text variant="body1">OR</Text>
                      <Divider borderColor="gray.700" />
                    </Flex>

                    <Heading as="h6" variant="h6" mb={4}>
                      Select from your contract list
                    </Heading>
                    <AllContractLists
                      contractLists={contractLists}
                      handleListSelect={handleListSelect}
                      isReadOnly
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
                  onClick={() => setListSlug("")}
                  cursor="pointer"
                  color="gray.600"
                />
                <Heading as="h5" variant="h5">
                  {contractList.name}
                </Heading>
              </DrawerHeader>
              <DrawerCloseButton />
              <DrawerBody maxH="full" overflowY="scroll">
                <ContractListDetail
                  contractListInfo={contractList}
                  isLoading={isLoading}
                  isReadOnly
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
