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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { trackUseOtherModal } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider/contexts";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import { capitalize } from "lodash";
import dynamic from "next/dynamic";
import { useState } from "react";

import { AddressType, AddressTypeSwitch } from "./AddressTypeSwitch";

const QrCode = dynamic(() => import("lib/components/QrCode"), {
  ssr: false,
});

interface AccountQrCodeModalProps {
  accountBechAddr: BechAddr;
  accountHexAddr?: HexAddr;
}

export const AccountQrCodeModal = ({
  accountBechAddr,
  accountHexAddr,
}: AccountQrCodeModalProps) => {
  const {
    chainConfig: { logo_URIs: logoUris },
    currentChainId,
  } = useCelatoneApp();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [addressType, setAddressType] = useState<AddressType>(
    AddressType.Bech32
  );

  const image = logoUris?.png || logoUris?.svg || logoUris?.jpeg;
  const displayAddress =
    addressType === AddressType.Hex && accountHexAddr
      ? accountHexAddr
      : accountBechAddr;

  return (
    <>
      <Flex
        onClick={(e) => {
          e.stopPropagation();
          trackUseOtherModal("Account QR code");
          onOpen();
          setAddressType(AddressType.Bech32);
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
        <ModalContent w={{ base: "full", md: "550px" }}>
          <ModalHeader>
            <CustomIcon boxSize={6} color="gray.600" name="qrcode" />
            <Heading as="h5" variant="h5">
              Address QR code
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody maxH="500px" px={6}>
            <Flex
              alignItems="center"
              border="1px solid"
              borderColor="gray.700"
              direction="column"
              gap={6}
              p={6}
            >
              <Text fontWeight={700}>{capitalize(currentChainId)}</Text>
              <QrCode data={displayAddress} image={image} />
              <Flex alignItems="center" direction="column" gap={2}>
                {accountHexAddr && (
                  <AddressTypeSwitch
                    currentTab={addressType}
                    onTabChange={setAddressType}
                  />
                )}
                <CopyLink type="user_address" value={displayAddress} />
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
