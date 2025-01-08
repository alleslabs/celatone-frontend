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
    direction="column"
    gap={2}
    w="full"
    bg="gray.900"
    borderTop="1px solid"
    borderColor="gray.900"
    py={4}
    bottom="0"
    position="sticky"
    zIndex={2}
    id="footer-cta"
    sx={sx}
  >
    <Flex align="center" justify="space-between" w="540px" h="full" mx="auto">
      <Button variant="outline-gray" w="128px" {...cancelButton}>
        {cancelLabel}
      </Button>
      <Button variant="primary" minW="128px" {...actionButton}>
        {loading ? <Spinner size="md" variant="light" /> : actionLabel}
      </Button>
    </Flex>
    {helperText && (
      <Text variant="body2" color="text.dark" textAlign="center">
        {helperText}
      </Text>
    )}
  </Flex>
);
