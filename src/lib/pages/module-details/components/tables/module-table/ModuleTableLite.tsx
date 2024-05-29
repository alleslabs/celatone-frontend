import { Flex, Heading } from "@chakra-ui/react";

// import type { HexAddr } from "lib/types";

const tableHeaderId = "moduleDetailsTableHeader";

// interface ModuleTablesLiteProps {
//   vmAddress: HexAddr;
//   moduleName: string;
// }

export const ModuleTablesLite = () => {
  // const { data, isLoading, error } = useModuleTxsLcd(
  //   vmAddress,
  //   moduleName,
  //   5,
  //   1
  // );

  // console.log(data);

  return (
    <Flex flexDirection="column" mt={6}>
      <Heading as="h6" variant="h6" mb={6} fontWeight={600} id={tableHeaderId}>
        Transactions
      </Heading>
      {/* <TransactionsTable
        transactions={data?.tx_responses}
        isLoading={isLoading}
        emptyState={
          error ? (
            <ErrorFetching dataName="transactions" />
          ) : (
            <EmptyState
              withBorder
              imageVariant="empty"
              message="There are no transactions on this module."
            />
          )
        }
        showAction={false}
        showRelations={false}
      /> */}
    </Flex>
  );
};
