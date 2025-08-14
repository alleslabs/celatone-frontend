import type { BechAddr, HexAddr } from "lib/types";

import {
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { trackUseOtherModal } from "lib/amplitude";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { QrCode } from "lib/components/QrCode";
import { Tooltip } from "lib/components/Tooltip";
import { useState } from "react";

import { AddressType, AddressTypeSwitch } from "./AddressTypeSwitch";

interface AccountQrCodeModalProps {
  accountBechAddr: BechAddr;
  accountHexAddr?: HexAddr;
}

export const AccountQrCodeModal = ({
  accountBechAddr,
  accountHexAddr,
}: AccountQrCodeModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [addressType, setAddressType] = useState<AddressType>(AddressType.init);

  const displayAddress =
    addressType === AddressType["0x"] && accountHexAddr
      ? accountHexAddr
      : accountBechAddr;

  return (
    <>
      <Flex
        onClick={(e) => {
          e.stopPropagation();
          trackUseOtherModal("Account QR code");
          onOpen();
          setAddressType(AddressType.init);
        }}
      >
        <Tooltip label="View QR code">
          <IconButton
            aria-label="show qrcode"
            icon={<CustomIcon boxSize={4} name="qrcode" />}
            size="sm"
            variant="ghost-gray-icon"
          />
        </Tooltip>
      </Flex>
      <Modal isCentered isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent w={{ base: "90%", md: "550px" }}>
          <ModalHeader>
            <CustomIcon boxSize={6} color="gray.600" name="qrcode" />
            <Heading as="h5" variant="h5">
              Address QR code
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody px={6}>
            <Flex
              alignItems="center"
              border="1px solid"
              borderColor="gray.700"
              borderRadius="8px"
              direction="column"
              gap={6}
              p={6}
            >
              {accountHexAddr && (
                <AddressTypeSwitch
                  currentTab={addressType}
                  onTabChange={setAddressType}
                />
              )}
              <QrCode address={displayAddress} />
              <CopyLink
                style={{
                  textAlign: "center",
                }}
                displayTextColor="text.main"
                type="user_address"
                value={displayAddress}
              />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
