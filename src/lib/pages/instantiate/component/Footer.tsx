import { Box, Button, Flex, Icon, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiChevronLeft } from "react-icons/fi";

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
      bg="pebble.900"
      h="70px"
      bottom="0"
      position="sticky"
      zIndex="sticky"
    >
      <Flex align="center" justify="space-between" w="540px" h="full" mx="auto">
        <Button
          variant="outline-gray"
          leftIcon={<Icon as={FiChevronLeft} fontSize="18px" />}
          onClick={router.back}
          w="128px"
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onInstantiate}
          disabled={disabled}
          w="128px"
        >
          {loading ? <Spinner size="md" color="pebble.600" /> : "Instantiate"}
        </Button>
      </Flex>
    </Box>
  );
};
