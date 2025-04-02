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
          {isLoading ? <Spinner size="md" variant="light" /> : "Execute Script"}
        </Button>
      </Flex>
    </Flex>
  );
};
