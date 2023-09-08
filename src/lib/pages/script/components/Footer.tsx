import { Button, Flex, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface FooterProps {
  // onSubmit: () => void;
  // disabled: boolean;
  isLoading: boolean;
}

export const Footer = ({ isLoading }: FooterProps) => {
  const router = useRouter();
  return (
    <Grid
      w="full"
      px={12}
      bg="gray.900"
      h="70px"
      bottom="0"
      position="sticky"
      zIndex={2}
      templateAreas={`"prespace main postspace"`}
      templateColumns="3fr 5fr 3fr"
    >
      <GridItem area="main">
        <Flex flex="5" align="center" justify="space-between" h="full" w="full">
          <Button variant="outline-primary" onClick={router.back}>
            Cancel
          </Button>
          <Button variant="primary">
            {isLoading ? (
              <Spinner size="md" variant="light" />
            ) : (
              "Execute Script"
            )}
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
};
