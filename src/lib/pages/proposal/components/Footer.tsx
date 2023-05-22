import { Button, Flex, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface FooterProps {
  onSubmit: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const Footer = ({
  onSubmit,
  disabled,
  isLoading = false,
}: FooterProps) => {
  const router = useRouter();
  return (
    <Grid
      w="full"
      px="48px"
      bg="gray.900"
      h="70px"
      bottom="0"
      position="sticky"
      zIndex={2}
      templateAreas={`"prespace main postspace"`}
      templateColumns="1fr 6fr 5fr"
    >
      <GridItem area="main">
        <Flex flex="5" align="center" justify="space-between" h="full" w="full">
          <Button variant="outline-primary" onClick={router.back}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={disabled}
            isDisabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="md" variant="light" />
            ) : (
              "Submit Proposal"
            )}
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
};
