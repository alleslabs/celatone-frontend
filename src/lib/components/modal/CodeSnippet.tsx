import {
  Modal,
  ModalHeader,
  Flex,
  // Icon,
  // Box,
  // Text,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

import { CustomTab } from "lib/components/CustomTab";

interface ModalProps {
  buttonProps: ButtonProps;
}

export function CodeSnippet({ buttonProps }: ModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex onClick={onOpen}>
        <Button {...buttonProps} />
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth={1} borderColor="divider.main">
            Code Snippet
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs>
              <TabList border="none" mb="32px">
                <CustomTab>All Codes</CustomTab>
                <CustomTab>My Stored Codes</CustomTab>
                <CustomTab>My Saved Codes </CustomTab>
              </TabList>

              <TabPanels mt="48px">
                <TabPanel p="0px">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
                  reiciendis odio reprehenderit obcaecati veniam delectus
                  laboriosam, deserunt quaerat harum, a possimus, rerum ut
                  distinctio quo officiis ad? Quas, cum voluptate. Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Ipsum esse veniam
                  recusandae minus consequuntur ducimus, asperiores rerum? Et
                  inventore illo maiores pariatur in nobis, tempore ipsa
                  assumenda tempora iure illum!
                </TabPanel>
                <TabPanel p="0px">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Explicabo doloribus tempora possimus voluptatem enim aut nobis
                  quasi nisi ut deleniti ipsa sed nostrum sint ad excepturi,
                  laborum, placeat aliquam laudantium.
                </TabPanel>
                <TabPanel p="0px">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tempore repudiandae voluptas facilis dicta officiis
                  consequuntur illum quasi voluptate optio, magnam corporis
                  deleniti eveniet vero quo ea nostrum voluptatem facere
                  architecto.
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
