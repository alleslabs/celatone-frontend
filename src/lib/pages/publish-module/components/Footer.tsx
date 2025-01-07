import { Box, Button, Flex, Grid, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface FooterProps {
  disabled: boolean;
  fieldAmount: number;
  isLoading: boolean;
  publishModule: () => void;
}

export const Footer = ({
  disabled,
  fieldAmount,
  isLoading = false,
  publishModule,
}: FooterProps) => {
  const router = useRouter();
  const publishText =
    fieldAmount > 1 ? `Publish ${fieldAmount} Modules` : "Publish Module";
  return (
    <Box bg="gray.900" h="70px" zIndex={2} bottom={0} position="sticky">
      <Grid
        h="full"
        maxW="1440px"
        mx="auto"
        px={{ base: "16px", md: "48px" }}
        templateAreas={`"prespace main accordion postspace"`}
        columnGap={4}
        templateColumns="1fr 6fr 4fr 1fr"
      >
        <Flex gridArea="main" align="center" justify="space-between">
          <Button variant="outline-primary" onClick={router.back}>
            Cancel
          </Button>
          <Button
            isDisabled={isLoading || disabled}
            variant="primary"
            onClick={publishModule}
          >
            {isLoading ? <Spinner size="md" variant="light" /> : publishText}
          </Button>
        </Flex>
      </Grid>
    </Box>
  );
};
