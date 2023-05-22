import {
  useDisclosure,
  Button,
  Heading,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { CustomIcon } from "lib/components/icon";
import { ADMIN_SPECIAL_SLUG } from "lib/data";
import { useContractStore } from "lib/providers/store";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { useContractListByAdmin } from "lib/services/contractService";
import type { ContractListInfo, ContractLocalInfo } from "lib/stores/contract";
import type { ContractAddr, HumanAddr } from "lib/types";
import { getCurrentDate } from "lib/utils";

import { ContractListDetail } from "./ContractListDetail";

interface SelectContractAdminProps {
  notSelected: boolean;
  onContractSelect: (contract: ContractAddr) => void;
}

export const SelectContractAdmin = ({
  notSelected,
  onContractSelect,
}: SelectContractAdminProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useWallet();
  const { getContractLocalInfo } = useContractStore();

  const { data: contracts = [], isLoading } = useContractListByAdmin(
    address as HumanAddr
  );
  const contractList: ContractListInfo = {
    name: ADMIN_SPECIAL_SLUG,
    slug: ADMIN_SPECIAL_SLUG,
    contracts: contracts.map<ContractLocalInfo>((contract) => ({
      ...contract,
      ...getContractLocalInfo(contract.contractAddress),
    })),
    lastUpdated: getCurrentDate(),
    isInfoEditable: false,
    isContractRemovable: false,
  };

  const onSelectThenClose = (contract: ContractAddr) => {
    onContractSelect(contract);
    onClose();
  };

  return (
    <>
      <Button
        variant={notSelected ? "primary" : "outline-primary"}
        py="6px"
        px="16px"
        size="sm"
        onClick={() => {
          AmpTrack(AmpEvent.USE_CONTRACT_MODAL);
          onOpen();
        }}
        leftIcon={
          !notSelected ? <CustomIcon name="swap" boxSize="12px" /> : undefined
        }
        disabled={!address}
      >
        {notSelected ? "Select Contract" : "Change Contract"}
      </Button>

      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent h="80%">
          <DrawerHeader>
            <CustomIcon
              name="contract-address-solid"
              boxSize="5"
              color="gray.600"
            />
            <Heading as="h5" variant="h5">
              Select contract which you have permission
            </Heading>
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody overflowY="scroll">
            <ContractListDetail
              contractListInfo={contractList}
              isLoading={isLoading}
              isReadOnly
              onContractSelect={onSelectThenClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
