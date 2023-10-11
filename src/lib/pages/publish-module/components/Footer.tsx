import { Box, Button, Flex, Grid, Spinner } from "@chakra-ui/react";
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
    <Box bg="gray.900" h="70px" bottom={0} position="sticky" zIndex={2}>
      <Grid
        px={{ base: "16px", md: "48px" }}
        templateAreas={`"prespace main accordion postspace"`}
        templateColumns="1fr 6fr 4fr 1fr"
        columnGap={4}
        maxW="1440px"
        mx="auto"
        h="full"
      >
        <Flex align="center" justify="space-between" gridArea="main">
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
      </Grid>
    </Box>
  );
};
