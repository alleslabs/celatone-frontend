import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { CustomIcon } from "lib/components/icon";

interface FooterProps {
  onInstantiate: () => void;
  disabled: boolean;
  loading: boolean;
}

export const Footer = ({ onInstantiate, disabled, loading }: FooterProps) => {
  const router = useRouter();
  return (
    <Box
      w="full"
      bg="gray.900"
      h="70px"
      bottom="0"
      position="sticky"
      zIndex={2}
    >
      <Flex align="center" justify="space-between" w="540px" h="full" mx="auto">
        <Button
          variant="outline-gray"
          leftIcon={<CustomIcon name="chevron-left" />}
          onClick={router.back}
          w="128px"
        >
          Previous
        </Button>
        <Button
          variant="primary"
          onClick={onInstantiate}
          disabled={disabled}
          w="128px"
        >
          {loading ? <Spinner size="md" variant="light" /> : "Instantiate"}
        </Button>
      </Flex>
    </Box>
  );
};
