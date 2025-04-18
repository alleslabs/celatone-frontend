import type { AxiosError } from "axios";
import type { BechAddr32, RpcQueryError } from "lib/types";
import type { KeyboardEvent } from "react";

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
import { useState } from "react";

import { CustomIcon } from "../icon";
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
        leftIcon={
          !notSelected ? <CustomIcon boxSize="12px" name="swap" /> : undefined
        }
        px={4}
        py={1}
        size="sm"
        variant={notSelected ? "primary" : "outline-primary"}
        onClick={() => {
          track(AmpEvent.USE_CONTRACT_MODAL);
          onOpen();
        }}
      >
        {notSelected ? "Select contract" : "Change contract"}
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
                  boxSize={5}
                  color="gray.600"
                  name="contract-address"
                />
                <Heading as="h5" variant="h5">
                  Select contract
                </Heading>
              </DrawerHeader>
              <DrawerCloseButton />

              <DrawerBody overflowY="scroll" p={6}>
                <Heading as="h6" mb={4} variant="h6">
                  Fill contract address manually
                </Heading>
                <Flex alignItems="center" gap={2}>
                  <Input
                    autoFocus
                    isInvalid={invalid !== ""}
                    placeholder={`ex. ${exampleContractAddress}`}
                    size="lg"
                    value={searchContract}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setSearchContract(inputValue as BechAddr32);
                    }}
                    onKeyDown={handleKeydown}
                  />
                  <Button
                    height="56px"
                    isDisabled={searchContract.length === 0}
                    isLoading={isFetching || isRefetching}
                    minW="72px"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Flex>
                <Text color="error.main" ml={3} mt={1} variant="body3">
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
                  boxSize={5}
                  color="gray.600"
                  cursor="pointer"
                  name="chevron-left"
                  onClick={() => setListSlug("")}
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
