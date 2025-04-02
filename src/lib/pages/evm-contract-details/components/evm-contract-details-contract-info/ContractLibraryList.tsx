import type { EvmVerifyInfoLibraries } from "lib/types";

import { Box, Divider, Grid, GridItem, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Fragment } from "react";

interface ContractLibraryListProps {
  libraries: EvmVerifyInfoLibraries;
}

const templateColumns = "20px minmax(100px, 120px) auto";

export const ContractLibraryList = ({
  libraries,
}: ContractLibraryListProps) => {
  const isMobile = useMobile();

  return (
    <Box bg="gray.900" borderRadius={8} p={4}>
      <Grid alignItems="center" gap={3} gridTemplateColumns={templateColumns}>
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
      <Grid alignItems="center" gap={3} gridTemplateColumns={templateColumns}>
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
                showCopyOnHover
                textFormat={isMobile ? "truncate" : "normal"}
                type="evm_contract_address"
                value={library.contractAddress}
              />
            </GridItem>
          </Fragment>
        ))}
      </Grid>
    </Box>
  );
};
