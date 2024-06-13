import { Box } from "@chakra-ui/react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import { EmptyState, ErrorFetching } from "lib/components/state";
import {
  ContractsTable,
  MobileTitle,
  TableTitle,
  ViewMore,
} from "lib/components/table";
import { useAccountContractsLcd } from "lib/pages/account-details/data";
import type { BechAddr32 } from "lib/types";

import type { InstantiatedContractsTableProps } from "./types";

export const InstantiatedContractsTableLite = ({
  address,
  onViewMore,
}: InstantiatedContractsTableProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const onRowSelect = (contract: BechAddr32) =>
    navigate({
      pathname: "/contracts/[contract]",
      query: { contract },
    });
  const { contracts, isLoading } = useAccountContractsLcd(address);

  const contractsCount = contracts?.length;
  const isMobileOverview = isMobile && !!onViewMore;
  return (
    <Box mt={{ base: 4, md: 8 }}>
      {isMobileOverview ? (
        <MobileTitle
          title="Contract Instances"
          count={contractsCount}
          onViewMore={onViewMore}
        />
      ) : (
        <>
          <TableTitle
            title="Contract Instances"
            count={contractsCount}
            helperText="This account instantiated the following contracts"
            mb={2}
          />
          <ContractsTable
            contracts={onViewMore ? contracts?.slice(0, 5) : contracts}
            isLoading={isLoading}
            emptyState={
              !contracts ? (
                <ErrorFetching dataName="contracts" />
              ) : (
                <EmptyState
                  message="No contracts have been instantiated by this account before."
                  withBorder
                />
              )
            }
            onRowSelect={onRowSelect}
            showLastUpdate={false}
          />
        </>
      )}
      {!!contractsCount &&
        (onViewMore
          ? contractsCount > 5 && !isMobile && <ViewMore onClick={onViewMore} />
          : null)}
    </Box>
  );
};
