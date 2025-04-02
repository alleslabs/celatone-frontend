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
  <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
    <DrawerOverlay />
    <DrawerContent h="90%">
      <DrawerHeader borderBottom="1px solid" borderColor="gray.700">
        <Heading as="h5" variant="h5">
          File tree
        </Heading>
      </DrawerHeader>
      <DrawerCloseButton color="text.dark" />
      <DrawerBody py={2} px={4}>
        <Box pb={4}>
          <EditorSidebar {...props} />
        </Box>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);
