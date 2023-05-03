import { TableContainer } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TableTitle } from "lib/components/table";
import {
  useTxsByBlockHeightPagination,
  useTxsCountByBlockHeight,
} from "lib/services/txService";

import { BlockTxTableHeader } from "./BlockTxTableHeader";
import { BlockTxTableRow } from "./BlockTxTableRow";

interface BlockTransactionTableProps {
  height: number;
}

const TEMPLATE_COLUMNS = "150px 45px minmax(400px,1fr) 150px 60px";
const scrollComponentId = "block_tx_table_header";

export const BlockTransactionTable = ({
  height,
}: BlockTransactionTableProps) => {
  const { data: blockTxCount } = useTxsCountByBlockHeight(height);
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: blockTxCount,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data: blockTxs, isLoading: blockTxLoading } =
    useTxsByBlockHeightPagination(height, pageSize, offset);

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  if (blockTxLoading) return <Loading />;
  if (!blockTxs || !blockTxCount)
    return (
      <>
        <TableTitle title="Transactions" count={0} />
        <EmptyState
          imageVariant="empty"
          message="There are no submitted transactions in this block"
          withBorder
        />
      </>
    );

  return (
    <>
      <TableTitle title="Transactions" count={blockTxCount} />
      <TableContainer>
        <BlockTxTableHeader
          templateColumns={TEMPLATE_COLUMNS}
          scrollComponentId={scrollComponentId}
        />
        {blockTxs.map((tx, idx) => (
          <BlockTxTableRow
            key={`block-tx-${idx.toString()}-${tx.hash}`}
            templateColumns={TEMPLATE_COLUMNS}
            transaction={tx}
          />
        ))}
      </TableContainer>
      {blockTxCount > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={blockTxCount}
          scrollComponentId={scrollComponentId}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
};
