import type { ButtonProps } from "@chakra-ui/react";
import type { AddressReturnType } from "lib/app-provider";
import type { BechAddr, TokenWithValue } from "lib/types";

import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { trackUseUnsupportedToken } from "lib/amplitude";

import type { IconKeys } from "../icon";

import { ExplorerLink } from "../ExplorerLink";
import { CustomIcon } from "../icon";
import { UnsupportedToken } from "../token";

interface UnsupportedTokensModalProps {
  unsupportedAssets: TokenWithValue[];
  address?: BechAddr;
  addressType?: AddressReturnType;
  buttonProps?: ButtonProps;
  amptrackSection?: string;
}

const unsupportedTokensContent = (
  addressType: AddressReturnType
): { icon: IconKeys; header: string } => {
  switch (addressType) {
    case "contract_address": {
      return {
        header: "Contract address",
        icon: "assets-solid",
      };
    }
    case "user_address": {
      return {
        header: "Account address",
        icon: "assets-solid",
      };
    }
    default:
      return {
        header: "Invalid address",
        icon: "alert-triangle-solid",
      };
  }
};

export const UnsupportedTokensModal = ({
  address,
  addressType = "invalid_address",
  amptrackSection,
  buttonProps,
  unsupportedAssets,
}: UnsupportedTokensModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  if (unsupportedAssets.length === 0) return null;

  const content = unsupportedTokensContent(addressType);
  return (
    <>
      <Button
        mb={1}
        size="sm"
        variant="ghost-gray"
        {...buttonProps}
        onClick={() => {
          trackUseUnsupportedToken(amptrackSection);
          onOpen();
        }}
      >
        {`View ${unsupportedAssets.length} unsupported assets`}
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="800px">
          <ModalHeader>
            <Flex alignItems="center" direction="row" gap={2} pt={1} w="full">
              <CustomIcon boxSize={5} color="gray.600" name={content.icon} />
              <Heading as="h5" variant="h5">
                Unsupported assets
              </Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody maxH="400px" overflow="overlay" pb={6}>
            <Flex direction="column" gap={5}>
              {address && (
                <Flex direction="row" gap={4}>
                  <Text fontWeight={700} variant="body2">
                    {content.header}
                  </Text>
                  <ExplorerLink type={addressType} value={address} />
                </Flex>
              )}
              <Flex direction="column" gap={3}>
                {unsupportedAssets.map((asset) => (
                  <UnsupportedToken key={asset.denom} token={asset} />
                ))}
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
