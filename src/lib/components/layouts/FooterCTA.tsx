import type { ButtonProps } from "@chakra-ui/react";
import { Box, Button, Flex, Spinner } from "@chakra-ui/react";

interface FooterCTAProps {
  loading?: boolean;
  cancelButton: ButtonProps;
  cancelLabel?: string;
  actionButton: ButtonProps;
  actionLabel?: string;
}

export const FooterCTA = ({
  loading = false,
  cancelButton,
  cancelLabel = "Previous",
  actionButton,
  actionLabel = "Submit",
}: FooterCTAProps) => (
  <Box
    w="full"
    bg="gray.900"
    h="70px"
    bottom="0"
    position="sticky"
    zIndex={2}
    id="footer-cta"
  >
    <Flex align="center" justify="space-between" w="540px" h="full" mx="auto">
      <Button variant="outline-gray" w="128px" {...cancelButton}>
        {cancelLabel}
      </Button>
      <Button variant="primary" w="128px" {...actionButton}>
        {loading ? <Spinner size="md" variant="light" /> : actionLabel}
      </Button>
    </Flex>
  </Box>
);
