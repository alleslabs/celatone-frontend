import { Button, Flex, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface FooterProps {
  disabled: boolean;
  isLoading: boolean;
  executeScript: () => void;
}

export const Footer = ({
  isLoading = false,
  disabled,
  executeScript,
}: FooterProps) => {
  const router = useRouter();
  return (
    <Flex
      w="full"
      bg="gray.900"
      h="70px"
      bottom={0}
      position="sticky"
      zIndex={2}
      justifyContent="center"
      alignItems="center"
    >
      <Flex justify="space-between" w="540px">
        <Button variant="outline-primary" onClick={router.back}>
          Cancel
        </Button>
        <Button
          variant="primary"
          isDisabled={isLoading || disabled}
          onClick={executeScript}
        >
          {isLoading ? <Spinner size="md" variant="light" /> : "Execute Script"}
        </Button>
      </Flex>
    </Flex>
  );
};
