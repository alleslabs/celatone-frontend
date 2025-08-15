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
import { Tooltip } from "lib/components/Tooltip";
import { TypeSwitch } from "lib/components/TypeSwitch";
import dynamic from "next/dynamic";
import { useState } from "react";

enum AddressType {
  bech32 = "init",
  hex = "0x",
}

interface AccountQrCodeModalProps {
  accountBechAddr: BechAddr;
  accountHexAddr?: HexAddr;
}

const DynamicQrCode = dynamic(() => import("lib/components/QrCode"), {
  ssr: false,
});

export const AccountQrCodeModal = ({
  accountBechAddr,
  accountHexAddr,
}: AccountQrCodeModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [addressType, setAddressType] = useState<AddressType>(
    AddressType.bech32
  );

  const displayAddress =
    addressType === AddressType.hex && accountHexAddr
      ? accountHexAddr
      : accountBechAddr;

  return (
    <>
      <Flex
        onClick={(e) => {
          e.stopPropagation();
          trackUseOtherModal("Account QR code");
          onOpen();
          setAddressType(AddressType.bech32);
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
                <TypeSwitch
                  currentTab={addressType}
                  disabledScrollToTop
                  fontSize="12px"
                  padding="4px 10px"
                  tabHeight={22}
                  tabs={[AddressType.bech32, AddressType.hex]}
                  tabWidth={40}
                  onTabChange={setAddressType}
                />
              )}
              <DynamicQrCode address={displayAddress} />
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
