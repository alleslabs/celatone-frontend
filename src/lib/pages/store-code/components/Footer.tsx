import { Button, Flex, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface FooterProps {
  // onSubmit: () => void;
  // disabled: boolean;
  loading: boolean;
}

export const Footer = ({
  // onSubmit,
  // disabled,
  loading = false,
}: FooterProps) => {
  const router = useRouter();
  return (
    <Flex
      gap={2}
      w="full"
      bg="pebble.900"
      h="70px"
      px={12}
      bottom="0"
      position="sticky"
      zIndex={2}
    >
      <Grid templateColumns="1fr 6fr 4fr 1fr" gap={4} w="100%">
        <GridItem w="100%" />
        <GridItem w="100%">
          <Flex
            flex="5"
            align="center"
            justify="space-between"
            h="full"
            w="full"
          >
            <Button variant="outline-gray" onClick={router.back}>
              Cancel
            </Button>
            <Button
              variant="primary"
              // onClick={onSubmit}
              // disabled={disabled}
            >
              {loading ? (
                <Spinner size="md" color="pebble.600" />
              ) : (
                "Submit Proposal"
              )}
            </Button>
          </Flex>
        </GridItem>
        <GridItem w="100%" />
        <GridItem w="100%" />
      </Grid>
    </Flex>
  );
};
