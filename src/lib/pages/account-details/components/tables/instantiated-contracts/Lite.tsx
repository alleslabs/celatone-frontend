import { Box } from "@chakra-ui/react";

import { AccountDetailsEmptyState } from "../../AccountDetailsEmptyState";
import AccountSectionWrapper from "../../AccountSectionWrapper";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { ErrorFetching } from "lib/components/state";
import { ContractsTable, MobileTitle, ViewMore } from "lib/components/table";
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
        <AccountSectionWrapper
          hasHelperText={!!contracts?.length}
          helperText="This account instantiated the following contracts"
          title="Contract Instances"
          totalData={contractsCount}
        >
          <ContractsTable
            emptyState={
              !contracts ? (
                <ErrorFetching
                  dataName="instantiated contracts"
                  my={2}
                  hasBorderTop={false}
                  withBorder
                />
              ) : (
                <AccountDetailsEmptyState message="No contracts have been instantiated by this account before." />
              )
            }
            contracts={onViewMore ? contracts?.slice(0, 5) : contracts}
            isLoading={isLoading}
            onRowSelect={onRowSelect}
            showLastUpdate={false}
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
