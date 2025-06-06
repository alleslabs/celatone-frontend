import { Button, Flex, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface FooterProps {
  disabled: boolean;
  executeScript: () => void;
  isLoading: boolean;
}

export const Footer = ({
  disabled,
  executeScript,
  isLoading = false,
}: FooterProps) => {
  const router = useRouter();
  return (
    <Flex
      alignItems="center"
      bg="gray.900"
      bottom={0}
      h="70px"
      justifyContent="center"
      position="sticky"
      w="full"
      zIndex={2}
    >
      <Flex justify="space-between" w="540px">
        <Button variant="outline-primary" onClick={router.back}>
          Cancel
        </Button>
        <Button
          isDisabled={isLoading || disabled}
          variant="primary"
          onClick={executeScript}
        >
          {isLoading ? <Spinner size="md" variant="light" /> : "Execute script"}
        </Button>
      </Flex>
    </Flex>
  );
};
