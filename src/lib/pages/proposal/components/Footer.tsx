import { Button, Flex, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface FooterProps {
  isDisabled: boolean;
  isLoading: boolean;
  onSubmit: () => void;
}

export const Footer = ({
  isDisabled,
  isLoading = false,
  onSubmit,
}: FooterProps) => {
  const router = useRouter();
  return (
    <Grid
      bg="gray.900"
      h="70px"
      px={12}
      templateAreas={`"prespace main postspace"`}
      w="full"
      zIndex={2}
      bottom="0"
      position="sticky"
      templateColumns="1fr 5fr 4fr"
    >
      <GridItem area="main">
        <Flex align="center" flex={5} h="full" justify="space-between" w="full">
          <Button variant="outline-primary" onClick={router.back}>
            Cancel
          </Button>
          <Button
            isDisabled={isLoading || isDisabled}
            variant="primary"
            onClick={onSubmit}
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
