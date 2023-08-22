import {
  Button,
  Text,
  Heading,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  Flex,
} from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { StateImage } from "lib/components/state";

interface ModuleSelectDrawerButtonProps {
  buttonText?: string;
}

export const ModuleSelectDrawerButton = ({
  buttonText = "Select Module",
}: ModuleSelectDrawerButtonProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Button
        variant="primary"
        ml="auto"
        onClick={() => {
          onOpen();
        }}
      >
        {buttonText}
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent h="80%">
          <DrawerHeader borderBottom="1px solid" borderColor="gray.700">
            <CustomIcon name="contract-address" boxSize={6} color="gray.600" />
            <Heading as="h5" variant="h5">
              Select Module
            </Heading>
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody
            p={6}
            overflow="scroll"
            display="flex"
            flexDirection="column"
          >
            <Flex bgColor="gray.800" px={4} py={3} mb={6} borderRadius={4}>
              {/* Input */}
              {/* <Flex justifyContent="space-between" w="full">
                TODO Input here
                <Flex gap={2}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onOpen();
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outline-white"
                    size="sm"
                    onClick={() => {
                      onOpen();
                    }}
                  >
                    Cancel
                  </Button>
                </Flex>
              </Flex> */}
              {/* Selected Address */}
              <Flex justifyContent="space-between" w="full" alignItems="center">
                <LabelText flex="1" label="Viewing Address">
                  <ExplorerLink
                    value="cltn1m9y7um59yxtmek68qkwg3ykm28s52rrell6prx"
                    type="user_address"
                    textFormat="normal"
                  />
                </LabelText>
                <LabelText flex="1" label="Hex">
                  <ExplorerLink
                    value="0xe688b84b23f322a994A53dbF8E15FA82CDB71127"
                    type="user_address"
                    textFormat="normal"
                  />
                </LabelText>
                <Button
                  variant="outline-white"
                  size="sm"
                  onClick={() => {
                    onOpen();
                  }}
                >
                  <CustomIcon name="swap" boxSize={3} />
                  Change Address
                </Button>
              </Flex>
            </Flex>
            <Flex
              h="full"
              justifyContent="center"
              alignItems="center"
              border="1px solid"
              borderRadius={4}
              borderColor="gray.700"
            >
              {/* Empty State */}
              <Flex flexDirection="column" gap={4} alignItems="center">
                <StateImage imageVariant="empty" width="160px" />
                <Text variant="body2" color="text.dark">
                  Available functions for selected modules will display here
                </Text>
              </Flex>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
