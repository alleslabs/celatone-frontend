import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { ADMIN_SPECIAL_SLUG } from "lib/data";
import { useContractStore } from "lib/providers/store";
import { useAllAdminContractsByAddress } from "lib/services/wasm/contract";
import type { ContractListInfo, ContractLocalInfo } from "lib/stores/contract";
import type { BechAddr32 } from "lib/types";
import { getCurrentDate } from "lib/utils";

import { ContractListDetail } from "./ContractListDetail";

interface SelectContractAdminProps {
  notSelected: boolean;
  onContractSelect: (contract: BechAddr32) => void;
}

export const SelectContractAdmin = ({
  notSelected,
  onContractSelect,
}: SelectContractAdminProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { address } = useCurrentChain();
  const { getContractLocalInfo } = useContractStore();

  const { data, isLoading } = useAllAdminContractsByAddress(address);

  const contractList: ContractListInfo = {
    contracts:
      data?.items.map<ContractLocalInfo>((contract) => ({
        ...contract,
        ...getContractLocalInfo(contract.contractAddress),
      })) ?? [],
    isContractRemovable: false,
    isInfoEditable: false,
    lastUpdated: getCurrentDate(),
    name: ADMIN_SPECIAL_SLUG,
    slug: ADMIN_SPECIAL_SLUG,
  };

  const onSelectThenClose = (contract: BechAddr32) => {
    onContractSelect(contract);
    onClose();
  };

  return (
    <>
      <Button
        isDisabled={!address}
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

      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent h="80%">
          <DrawerHeader>
            <CustomIcon name="contract-address" boxSize={5} color="gray.600" />
            <Heading as="h5" variant="h5">
              Select contract which you have permission
            </Heading>
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody py={4} overflowY="scroll">
            <ContractListDetail
              isReadOnly
              contractListInfo={contractList}
              isLoading={isLoading}
              onContractSelect={onSelectThenClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
