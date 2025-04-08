import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
} from "@chakra-ui/react";

import type { EditorSidebarProps } from "./EditorSidebar";

import { EditorSidebar } from "./EditorSidebar";

export interface FullEditorSidebarMobileProps extends EditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullEditorSidebarMobile = ({
  isOpen,
  onClose,
  ...props
}: FullEditorSidebarMobileProps) => (
  <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
    <DrawerOverlay />
    <DrawerContent h="90%">
      <DrawerHeader
        borderBottomWidth="1px"
        borderColor="gray.700"
        borderStyle="solid"
      >
        <Heading as="h5" variant="h5">
          File tree
        </Heading>
      </DrawerHeader>
      <DrawerCloseButton color="text.dark" />
      <DrawerBody px={4} py={2}>
        <Box pb={4}>
          <EditorSidebar {...props} />
        </Box>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);
