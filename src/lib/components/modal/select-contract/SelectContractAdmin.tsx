import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { MdList, MdSwapHoriz } from "react-icons/md";

import { ADMIN_SPECIAL_SLUG } from "lib/data";
import { useContractStore } from "lib/hooks";
import { useContractListByAdmin } from "lib/services/contractService";
import type { ContractListInfo, ContractLocalInfo } from "lib/stores/contract";
import type { ContractAddr, HumanAddr } from "lib/types";

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

  const { data: contracts = [] } = useContractListByAdmin(address as HumanAddr);
  const contractList: ContractListInfo = {
    name: ADMIN_SPECIAL_SLUG,
    slug: ADMIN_SPECIAL_SLUG,
    contracts: contracts.map<ContractLocalInfo>((contract) => ({
      ...contract,
      ...getContractLocalInfo(contract.contractAddress),
    })),
    lastUpdated: new Date(),
    isInfoEditable: false,
    isContractRemovable: false,
  };

  const resetOnClose = () => {
    onClose();
  };

  const onSelectThenClose = (contract: ContractAddr) => {
    onContractSelect(contract);
    resetOnClose();
  };

  return (
    <>
      <Button
        variant={notSelected ? "primary" : "outline-info"}
        py="6px"
        px="16px"
        size="sm"
        onClick={onOpen}
        leftIcon={
          !notSelected ? <Icon as={MdSwapHoriz} boxSize="5" /> : undefined
        }
      >
        {notSelected ? "Select Contract" : "Change Contract"}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={resetOnClose}
        closeOnOverlayClick={false}
        size="4xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent h="80%">
          <ModalHeader>
            <Icon as={MdList} color="text.dark" fontSize="24px" />
            <Heading as="h5" variant="h5">
              Select contract which you have permission
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
        </ModalContent>
      </Modal>
    </>
  );
};
