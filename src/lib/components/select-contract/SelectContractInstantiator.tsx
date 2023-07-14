import {
  useDisclosure,
  Button,
  Text,
  Input,
  Flex,
  Divider,
  Heading,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";

import { CustomIcon } from "../icon";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useMobile,
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
    chainConfig: {
      exampleAddresses: { contract: exampleContractAddress },
    },
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
  const { instantiatedListInfo, isLoading } = useInstantiatedByMe(true);
  const contractLists = [instantiatedListInfo, ...getContractLists()];
  const contractList = contractLists.find((item) => item.slug === listSlug);

  const lcdEndpoint = useBaseApiRoute("rest");

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
    [CELATONE_QUERY_KEYS.CONTRACT_INFO, lcdEndpoint, searchContract],
    async () => queryContract(lcdEndpoint, searchContract as ContractAddr),
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

  const isMobile = useMobile();
  return (
    <>
      <Button
        variant={notSelected ? "primary" : "outline-primary"}
        py={1}
        size="sm"
        px={4}
        onClick={() => {
          AmpTrack(AmpEvent.USE_CONTRACT_MODAL);
          onOpen();
        }}
        leftIcon={
          !notSelected ? <CustomIcon name="swap" boxSize="12px" /> : undefined
        }
      >
        {notSelected ? "Select Contract" : "Change Contract"}
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
                  name="contract-address-solid"
                  boxSize={5}
                  color="gray.600"
                />
                <Heading as="h5" variant="h5">
                  Select Contract
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
                      setSearchContract(inputValue as ContractAddr);
                    }}
                    placeholder={`ex. ${exampleContractAddress}`}
                    size="lg"
                  />
                  <Button
                    height="56px"
                    minW="72px"
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
                {!isMobile && (
                  <>
                    <Flex my={6} gap={2} alignItems="center">
                      <Divider borderColor="gray.700" />
                      <Text variant="body1">OR</Text>
                      <Divider borderColor="gray.700" />
                    </Flex>

                    <Heading as="h6" variant="h6" mb={4}>
                      Select from your Contract List
                    </Heading>
                    <AllContractLists
                      contractLists={contractLists}
                      handleListSelect={handleListSelect}
                      isReadOnly
                      formLabelBgColor="gray.900"
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
