import type { BechAddr32 } from "lib/types";

import { Box } from "@chakra-ui/react";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { ErrorFetching } from "lib/components/state";
import { ContractsTable, MobileTitle, ViewMore } from "lib/components/table";
import { useAccountContractsRest } from "lib/pages/account-details/data";

import type { InstantiatedContractsTableProps } from "./types";

import { AccountDetailsEmptyState } from "../../AccountDetailsEmptyState";
import AccountSectionWrapper from "../../AccountSectionWrapper";

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
  const { contracts, isLoading } = useAccountContractsRest(address);

  const contractsCount = contracts?.length;
  const isMobileOverview = isMobile && !!onViewMore;
  return (
    <Box mt={{ base: 4, md: 8 }}>
      {isMobileOverview ? (
        <MobileTitle
          count={contractsCount}
          title="Contract instances"
          onViewMore={onViewMore}
        />
      ) : (
        <AccountSectionWrapper
          hasHelperText={!!contracts?.length}
          helperText="This account instantiated the following contracts"
          title="Contract instances"
          totalData={contractsCount}
        >
          <ContractsTable
            contracts={onViewMore ? contracts?.slice(0, 5) : contracts}
            emptyState={
              !contracts ? (
                <ErrorFetching
                  dataName="instantiated contracts"
                  hasBorderTop={false}
                  my={2}
                  withBorder
                />
              ) : (
                <AccountDetailsEmptyState message="No contracts have been instantiated by this account before." />
              )
            }
            isLoading={isLoading}
            showLastUpdate={false}
            onRowSelect={onRowSelect}
          />
        </AccountSectionWrapper>
      )}
      {!!contractsCount &&
        (onViewMore
          ? contractsCount > 5 && !isMobile && <ViewMore onClick={onViewMore} />
          : null)}
    </Box>
  );
};
