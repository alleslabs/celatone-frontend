import type { ButtonProps } from "@chakra-ui/react";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";

interface FooterCTAProps {
  loading?: boolean;
  cancelButton: ButtonProps;
  cancelLabel?: string;
  actionButton: ButtonProps;
  actionLabel?: string;
  helperText?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export const FooterCta = ({
  loading = false,
  cancelButton,
  cancelLabel = "Previous",
  actionButton,
  actionLabel = "Submit",
  helperText,
  backgroundColor,
  borderColor,
}: FooterCTAProps) => (
  <Flex
    direction="column"
    gap={2}
    w="full"
    bg={backgroundColor ?? "gray.900"}
    borderTop="1px solid"
    borderColor={borderColor ?? "gray.900"}
    py={4}
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
    {helperText && (
      <Text variant="body2" color="text.dark" textAlign="center">
        {helperText}
      </Text>
    )}
  </Flex>
);
