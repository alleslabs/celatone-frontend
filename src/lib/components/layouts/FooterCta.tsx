import type { ButtonProps, SystemStyleObject } from "@chakra-ui/react";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";

interface FooterCtaProps {
  actionButton: ButtonProps;
  actionLabel?: string;
  cancelButton: ButtonProps;
  cancelLabel?: string;
  helperText?: string;
  loading?: boolean;
  sx?: SystemStyleObject;
}

export const FooterCta = ({
  actionButton,
  actionLabel = "Submit",
  cancelButton,
  cancelLabel = "Previous",
  helperText,
  loading = false,
  sx,
}: FooterCtaProps) => (
  <Flex
    id="footer-cta"
    bg="gray.900"
    gap={2}
    py={4}
    sx={sx}
    w="full"
    zIndex={2}
    borderColor="gray.900"
    borderTop="1px solid"
    bottom="0"
    direction="column"
    position="sticky"
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
      <Text textAlign="center" variant="body2" color="text.dark">
        {helperText}
      </Text>
    )}
  </Flex>
);
