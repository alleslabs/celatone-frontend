import { useMemo } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ModulesTable } from "lib/components/table";
import { useModules } from "lib/services/move/module";
import type { MoveVerifyInfoResponse } from "lib/services/types";
import { useMoveVerifyInfos } from "lib/services/verification/move";
import { mergeModulePath } from "lib/utils";

export const RecentModulesTable = () => {
  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
    setTotalData,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
    },
  });
  const { data, error, isLoading } = useModules(pageSize, offset, {
    onSuccess: ({ total }) => setTotalData(total),
  });

  const results = useMoveVerifyInfos(
    data?.items.map((module) => ({
      address: module.address,
      moduleName: module.moduleName,
    })) ?? [],
    !!data
  );

  const moveVerifyInfos = useMemo(() => {
    return results.reduce<Record<string, MoveVerifyInfoResponse>>(
      (acc, result) => {
        if (result.data)
          acc[
            mergeModulePath(result.data.moduleAddress, result.data.moduleName)
          ] = result.data;
        return acc;
      },
      {}
    );
  }, [results]);

  return (
    <>
      <ModulesTable
        emptyState={
          error ? (
            <ErrorFetching dataName="modules" />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="There are no modules on this network yet."
              withBorder
            />
          )
        }
        isLoading={isLoading}
        modules={data?.items}
        moveVerifyInfos={moveVerifyInfos}
      />
      {!!data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          offset={offset}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
          totalData={data.total}
        />
      )}
    </>
  );
};
