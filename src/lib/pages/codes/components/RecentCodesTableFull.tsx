import type { PermissionFilterValue } from "lib/hooks";

import { Box } from "@chakra-ui/react";
import { useCurrentChain, useInternalNavigate } from "lib/app-provider";
import { FilterByPermission } from "lib/components/forms";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { CodesTable } from "lib/components/table";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useRecentCodes } from "../data";

interface RecentCodesState {
  permissionValue: PermissionFilterValue;
}

export const RecentCodesTableFull = observer(() => {
  const navigate = useInternalNavigate();
  const { address } = useCurrentChain();

  const { watch, setValue } = useForm<RecentCodesState>({
    defaultValues: {
      permissionValue: "all",
    },
  });
  const { permissionValue } = watch();

  const {
    pagesQuantity,
    setTotalData,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });
  const { data, isLoading } = useRecentCodes(
    pageSize,
    offset,
    address,
    permissionValue,
    setTotalData
  );

  const onRowSelect = (codeId: number) =>
    navigate({
      pathname: "/codes/[codeId]",
      query: { codeId },
    });

  useEffect(() => {
    setCurrentPage(1);
    setPageSize(10);
  }, [permissionValue, setCurrentPage, setPageSize]);

  return (
    <>
      <Box mb={4} mt={8}>
        <FilterByPermission
          initialSelected="all"
          maxWidth="full"
          setPermissionValue={(newVal: PermissionFilterValue) => {
            if (newVal === permissionValue) return;
            setValue("permissionValue", newVal);
          }}
        />
      </Box>
      <CodesTable
        codes={data?.items}
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="This network does not have any codes."
            withBorder
          />
        }
        isLoading={isLoading}
        onRowSelect={onRowSelect}
      />
      {data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          totalData={data.total}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </>
  );
});
