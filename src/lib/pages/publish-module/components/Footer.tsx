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
    fieldAmount > 1 ? `Publish ${fieldAmount} modules` : "Publish module";
  return (
    <Box bg="gray.900" bottom={0} h="70px" position="sticky" zIndex={2}>
      <Grid
        columnGap={4}
        h="full"
        maxW="1440px"
        mx="auto"
        px={{ base: "16px", md: "48px" }}
        templateAreas={`"prespace main accordion postspace"`}
        templateColumns="1fr 6fr 4fr 1fr"
      >
        <Flex align="center" gridArea="main" justify="space-between">
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
