import type { ButtonProps } from "@chakra-ui/react";
import {
  Modal,
  ModalHeader,
  Flex,
  Text,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  ModalBody,
  Button,
  Heading,
} from "@chakra-ui/react";

import { ExplorerLink } from "../ExplorerLink";
import type { IconKeys } from "../icon";
import { CustomIcon } from "../icon";
import { Tooltip } from "../Tooltip";
import { trackUseUnsupportedToken } from "lib/amplitude";
import { useGetAddressType } from "lib/app-provider";
import type { AddressReturnType } from "lib/app-provider";
import { Copier } from "lib/components/copy";
import type { Addr, TokenWithValue } from "lib/types";
import {
  getTokenType,
  getTokenLabel,
  formatUTokenWithPrecision,
} from "lib/utils";

interface UnsupportedTokensModalProps {
  unsupportedAssets: TokenWithValue[];
  address?: Addr;
  addressType?: AddressReturnType;
  buttonProps?: ButtonProps;
  amptrackSection?: string;
}

const getTokenTypeWithAddress = (addrType: AddressReturnType) =>
  addrType === "contract_address"
    ? getTokenType("cw20")
    : getTokenType("native");

const UnsupportedToken = ({ token }: { token: TokenWithValue }) => {
  const getAddressType = useGetAddressType();
  const tokenType = !token.denom.includes("/")
    ? getTokenTypeWithAddress(getAddressType(token.denom))
    : getTokenType(token.denom.split("/")[0]);

  return (
    <Flex
      className="copier-wrapper"
      borderRadius="8px"
      bg="gray.800"
      direction="column"
      px={4}
      py={3}
      role="group"
      _hover={{
        "& .info": {
          visibility: "visible",
        },
      }}
    >
      <Flex
        direction="row"
        justifyContent="space-between"
        w="full"
        alignItems="center"
      >
        <Flex gap={1} alignItems="center">
          <Text variant="body2" className="ellipsis">
            {getTokenLabel(token.denom, token.symbol)}
          </Text>
          <Tooltip label={`Token ID: ${token.denom}`} maxW="500px">
            <Flex cursor="pointer" className="info" visibility="hidden">
              <CustomIcon name="info-circle" boxSize={3} color="gray.600" />
            </Flex>
          </Tooltip>
          <Copier
            type="unsupported_asset"
            value={token.denom}
            copyLabel="Token ID Copied!"
            ml={0}
            display="none"
            amptrackSection="unsupported_token_copy"
          />
        </Flex>
        <Text variant="body3" color="text.dark">
          {`${tokenType} Token`}
        </Text>
      </Flex>
      <Text variant="body2" fontWeight="900">
        {formatUTokenWithPrecision(token.amount, 0, false)}
      </Text>
    </Flex>
  );
};

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
        icon: "question-solid",
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
