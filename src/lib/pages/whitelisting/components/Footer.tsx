import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface FooterProps {
  // onSubmit: () => void;
  // disabled: boolean;
  loading: boolean;
}

export const Footer = ({
  // onSubmit,
  // disabled,
  loading = false,
}: FooterProps) => {
  const router = useRouter();
  return (
    <Flex
      gap={2}
      w="full"
      bg="pebble.900"
      h="70px"
      bottom="0"
      position="sticky"
      zIndex={2}
    >
      <Box flex="1" />
      <Flex flex="5" align="center" justify="space-between" h="full" w="full">
        <Button variant="outline-gray" onClick={router.back}>
          Cancel
        </Button>
        <Button
          variant="primary"
          // onClick={onSubmit}
          // disabled={disabled}
        >
          {loading ? (
            <Spinner size="md" color="pebble.600" />
          ) : (
            "Submit Proposal"
          )}
        </Button>
      </Flex>
      <Box flex="5" />
    </Flex>
  );
};
