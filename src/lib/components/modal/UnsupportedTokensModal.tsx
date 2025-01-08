import type { ButtonProps } from "@chakra-ui/react";
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

import { ExplorerLink } from "../ExplorerLink";
import type { IconKeys } from "../icon";
import { CustomIcon } from "../icon";
import { UnsupportedToken } from "../token";
import { trackUseUnsupportedToken } from "lib/amplitude";
import type { AddressReturnType } from "lib/app-provider";
import type { BechAddr, TokenWithValue } from "lib/types";

interface UnsupportedTokensModalProps {
  address?: BechAddr;
  addressType?: AddressReturnType;
  amptrackSection?: string;
  buttonProps?: ButtonProps;
  unsupportedAssets: TokenWithValue[];
}

const unsupportedTokensContent = (
  addressType: AddressReturnType
): { header: string; icon: IconKeys } => {
  switch (addressType) {
    case "contract_address": {
      return {
        header: "Contract Address",
        icon: "assets-solid",
      };
    }
    case "user_address": {
      return {
        header: "Account Address",
        icon: "assets-solid",
      };
    }
    default:
      return {
        header: "Invalid Address",
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
        {`View ${unsupportedAssets.length} Unsupported Assets`}
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="800px">
          <ModalHeader>
            <Flex alignItems="center" gap={2} pt={1} w="full" direction="row">
              <CustomIcon name={content.icon} boxSize={5} color="gray.600" />
              <Heading as="h5" variant="h5">
                Unsupported Assets
              </Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody maxH="400px" pb={6} overflow="overlay">
            <Flex gap={5} direction="column">
              {address && (
                <Flex gap={4} direction="row">
                  <Text variant="body2" fontWeight={700}>
                    {content.header}
                  </Text>
                  <ExplorerLink type={addressType} value={address} />
                </Flex>
              )}
              <Flex gap={3} direction="column">
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
