import { Button, Flex, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface FooterProps {
  publishModule: () => void;
  disabled: boolean;
  isLoading: boolean;
  fieldAmount: number;
}

export const Footer = ({
  isLoading = false,
  disabled,
  fieldAmount,
  publishModule,
}: FooterProps) => {
  const router = useRouter();
  const publishText =
    fieldAmount > 1 ? `Publish ${fieldAmount} Modules` : "Publish Module";
  return (
    <Grid
      w="full"
      px={12}
      bg="gray.900"
      h="70px"
      bottom={0}
      position="sticky"
      zIndex={2}
      templateAreas={`"prespace main accordion postspace"`}
      templateColumns="1fr 6fr 4fr 1fr"
      columnGap={4}
    >
      <GridItem area="main">
        <Flex align="center" justify="space-between" h="full">
          <Button variant="outline-primary" onClick={router.back}>
            Cancel
          </Button>
          <Button
            variant="primary"
            isDisabled={isLoading || disabled}
            onClick={publishModule}
          >
            {isLoading ? <Spinner size="md" variant="light" /> : publishText}
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
};
