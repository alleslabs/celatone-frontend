import {
  Flex,
  Input,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

const getZeroState = ({
  isWasm,
  isPool,
  isMove,
  isGov,
}: {
  isWasm: boolean;
  isPool: boolean;
  isMove: boolean;
  isGov: boolean;
}) => {
  const starter = ["Account Address", "TX Hash", "Block Height"];
  const govText = isGov ? ["Validator Address", "Proposal ID"] : [];
  const wasmText = isWasm ? ["Code ID", "Contract Address"] : [];
  const moveText = isMove ? ["Module Path"] : [];
  const poolText = isPool ? ["Pool ID"] : [];

  const supportedItemsType = starter.concat(
    govText,
    wasmText,
    moveText,
    poolText
  );

  return (
    <Flex direction="column" gap={4} py={8}>
      <Text color="text.dark"> Please enter keyword, You can search with:</Text>
      <Flex
        direction="column"
        px={4}
        py={2}
        border="1px solid"
        borderColor="gray.700"
        borderRadius={8}
      >
        {supportedItemsType.map((item) => (
          <Flex alignItems="center" gap={3}>
            <Flex w={1} h={1} borderRadius="full" bgColor="primary.darker" />
            <Text color="text.dark">{item}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

const getResult = () => (
  <Flex direction="column" gap={3}>
    <Text variant="body2" color="text.dark">
      5 Matched results...
    </Text>
    <Flex
      py={1}
      px={2}
      gap={3}
      alignItems="center"
      borderRadius={8}
      cursor="pointer"
      transition="all 0.25s ease-in-out"
      _hover={{
        background: "gray.700",
      }}
    >
      <CustomIcon name="code" />
      <Flex alignItems="center" gap={1}>
        <Text variant="body2" color="text.main">
          123
        </Text>
        <Text variant="body2" color="text.dark">
          - Code
        </Text>
      </Flex>
    </Flex>
  </Flex>
);

export const SearchComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    currentChainId,
    chainConfig: {
      features: {
        gov: { enabled: isGov },
        wasm: { enabled: isWasm },
        move: { enabled: isMove },
        pool: { enabled: isPool },
      },
    },
  } = useCelatoneApp();
  return (
    <>
      <Flex
        onClick={onOpen}
        w="full"
        maxH="40px"
        p={2}
        alignItems="center"
        justifyContent="space-between"
        border="1px solid"
        borderColor="gray.700"
        borderRadius={8}
        cursor="pointer"
        transition="all 0.25s ease-in-out"
        _hover={{
          background: "gray.800",
        }}
      >
        <Flex gap={1}>
          <CustomIcon color="gray.600" name="search" boxSize={4} />
          <Text variant="body1" color="text.disabled">
            Search on {currentChainId}
          </Text>
        </Flex>
        <Flex pb={1} borderRadius={4}>
          <span>
            <Kbd>⌘</Kbd> <Kbd>K</Kbd>
          </span>
        </Flex>
      </Flex>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent
          w={{ base: "full", md: "800px" }}
          bg="gray.800"
          maxW="100vw"
        >
          <ModalHeader
            position="relative"
            p={0}
            borderBottom="1px solid"
            borderBottomColor="gray.700"
          >
            <Input
              w="100%"
              minW="200px"
              size="lg"
              placeholder="Enter your keyword..."
              style={{ maxHeight: "54px", border: "none" }}
              mr={24}
            />
            <Tag
              variant="accent-darker"
              size="sm"
              position="absolute"
              right={4}
            >
              {currentChainId}
            </Tag>
          </ModalHeader>
          {/* <ModalCloseButton color="gray.400" /> */}
          <ModalBody>
            <Flex justifyContent="center">
              {getZeroState({ isWasm, isPool, isMove, isGov })}
            </Flex>
            {getResult()}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
