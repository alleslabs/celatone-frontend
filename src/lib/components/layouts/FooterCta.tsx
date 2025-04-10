import type { ButtonProps, SystemStyleObject } from "@chakra-ui/react";

import { Button, Flex, Spinner, Text } from "@chakra-ui/react";

interface FooterCtaProps {
  loading?: boolean;
  cancelButton: ButtonProps;
  cancelLabel?: string;
  actionButton: ButtonProps;
  actionLabel?: string;
  helperText?: string;
  sx?: SystemStyleObject;
}

export const FooterCta = ({
  loading = false,
  cancelButton,
  cancelLabel = "Previous",
  actionButton,
  actionLabel = "Submit",
  helperText,
  sx,
}: FooterCtaProps) => (
  <Flex
    id="footer-cta"
    bg="gray.900"
    borderColor="gray.900"
    borderTop="1px solid"
    bottom="0"
    direction="column"
    gap={2}
    position="sticky"
    py={4}
    sx={sx}
    w="full"
    zIndex={2}
  >
    <Flex align="center" h="full" justify="space-between" mx="auto" w="540px">
      <Button variant="outline-gray" w="128px" {...cancelButton}>
        {cancelLabel}
      </Button>
      <Button minW="128px" variant="primary" {...actionButton}>
        {loading ? <Spinner size="md" variant="light" /> : actionLabel}
      </Button>
    </Flex>
    {helperText && (
      <Text color="text.dark" textAlign="center" variant="body2">
        {helperText}
      </Text>
    )}
  </Flex>
);
