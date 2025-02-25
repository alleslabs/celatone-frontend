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

import { trackUseUnsupportedToken } from "lib/amplitude";
import type { AddressReturnType } from "lib/app-provider";
import type { BechAddr, TokenWithValue } from "lib/types";
import { ExplorerLink } from "../ExplorerLink";
import type { IconKeys } from "../icon";
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
        icon: "assets-solid",
        header: "Contract Address",
      };
    }
    case "user_address": {
      return {
        icon: "assets-solid",
        header: "Account Address",
      };
    }
    default:
      return {
        icon: "alert-triangle-solid",
        header: "Invalid Address",
      };
  }
};

export const UnsupportedTokensModal = ({
  unsupportedAssets,
  address,
  addressType = "invalid_address",
  buttonProps,
  amptrackSection,
}: UnsupportedTokensModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (unsupportedAssets.length === 0) return null;

  const content = unsupportedTokensContent(addressType);
  return (
    <>
      <Button
        variant="ghost-gray"
        mb={1}
        size="sm"
        {...buttonProps}
        onClick={() => {
          trackUseUnsupportedToken(amptrackSection);
          onOpen();
        }}
      >
        {`View ${unsupportedAssets.length} Unsupported Assets`}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent w="800px">
          <ModalHeader>
            <Flex w="full" direction="row" alignItems="center" gap={2} pt={1}>
              <CustomIcon name={content.icon} boxSize={5} color="gray.600" />
              <Heading variant="h5" as="h5">
                Unsupported Assets
              </Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody maxH="400px" overflow="overlay" pb={6}>
            <Flex direction="column" gap={5}>
              {address && (
                <Flex direction="row" gap={4}>
                  <Text variant="body2" fontWeight={700}>
                    {content.header}
                  </Text>
                  <ExplorerLink value={address} type={addressType} />
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
