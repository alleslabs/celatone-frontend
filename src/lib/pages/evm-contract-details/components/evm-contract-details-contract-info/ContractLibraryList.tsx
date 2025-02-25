import { Box, Divider, Grid, GridItem, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { EvmVerifyInfoLibraries } from "lib/types";

interface ContractLibraryListProps {
  libraries: EvmVerifyInfoLibraries;
}

const templateColumns = "20px minmax(100px, 120px) auto";

export const ContractLibraryList = ({
  libraries,
}: ContractLibraryListProps) => {
  const isMobile = useMobile();

  return (
    <Box p={4} bg="gray.900" borderRadius={8}>
      <Grid gridTemplateColumns={templateColumns} gap={3} alignItems="center">
        <GridItem>
          <Text color="text.dark" variant="body2">
            #
          </Text>
        </GridItem>
        <GridItem>
          <Text color="text.dark" variant="body2">
            Library Name
          </Text>
        </GridItem>
        <GridItem>
          <Text color="text.dark" variant="body2">
            Library Address
          </Text>
        </GridItem>
      </Grid>
      <Divider my={3} />
      <Grid gridTemplateColumns={templateColumns} gap={3} alignItems="center">
        {libraries.map((library, index) => (
          <Fragment key={index}>
            <GridItem>
              <Text color="text.dark" variant="body2">
                {index + 1}
              </Text>
            </GridItem>
            <GridItem>
              <Text color="text.dark" variant="body2">
                {library.contractName}
              </Text>
            </GridItem>
            <GridItem>
              <ExplorerLink
                value={library.contractAddress}
                type="evm_contract_address"
                textFormat={isMobile ? "truncate" : "normal"}
                showCopyOnHover
              />
            </GridItem>
          </Fragment>
        ))}
      </Grid>
    </Box>
  );
};
