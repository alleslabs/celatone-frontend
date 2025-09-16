import type { EvmCallFrame, EvmVerifyInfosResponse } from "lib/services/types";
import type { AssetInfos, Nullable, Option } from "lib/types";

import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Grid,
  type GridProps,
  Text,
} from "@chakra-ui/react";
import { EvmInputData } from "lib/components/EvmInputData";
// import { EvmMethodChip } from "lib/components/EvmMethodChip";
// import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import {
  coinToTokenWithValue,
  formatInteger,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

import { TableRow } from "../tableComponents";

interface EvmInternalTransactionTableRowProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: Option<string>;
  evmVerifyInfos: Option<Nullable<EvmVerifyInfosResponse>>;
  nestedIndex?: number;
  result: EvmCallFrame;
  showParentHash?: boolean;
  templateColumns: GridProps["templateColumns"];
  txHash: Option<string>;
}

export const EvmInternalTransactionTableRow = ({
  assetInfos,
  evmDenom,
  evmVerifyInfos,
  // nestedIndex = 0,
  result,
  // showParentHash = true,
  templateColumns,
  // txHash,
}: EvmInternalTransactionTableRowProps) => {
  const token = coinToTokenWithValue(
    evmDenom ?? "",
    result.value?.toString() ?? "0",
    assetInfos
  );

  return (
    <AccordionItem>
      {({ isExpanded }) => {
        const styles = {
          borderColor: isExpanded ? "transparent" : "gray.700",
        };

        return (
          <>
            <AccordionButton p={0}>
              <Grid
                className="copier-wrapper"
                cursor="pointer"
                sx={{
                  "> div": {
                    paddingLeft: "4px",
                    paddingRight: "4px",
                  },
                }}
                templateColumns={templateColumns}
                w="full"
              >
                <TableRow
                  alignItems="start"
                  flexDirection="column"
                  justifyContent="center"
                  {...styles}
                >
                  <Text color="text.dark" variant="body2">
                    {formatUTokenWithPrecision({
                      amount: token.amount,
                      precision: token.precision ?? 0,
                    })}{" "}
                    {getTokenLabel(token.denom, token.symbol)}
                  </Text>
                </TableRow>
                <TableRow>
                  <Text color="text.dark" variant="body2">
                    {formatInteger(result.gas.toString())}
                  </Text>
                </TableRow>
                <TableRow justifyContent="flex-end">
                  <CustomIcon
                    color="gray.600"
                    name="chevron-down"
                    transform={isExpanded ? "rotate(-180deg)" : "rotate(0deg)"}
                    transition="all 0.25s ease-in-out"
                  />
                </TableRow>
              </Grid>
            </AccordionButton>
            <AccordionPanel
              borderBottom="1px solid"
              borderColor="gray.700"
              p={0}
              pb={5}
            >
              <EvmInputData
                evmVerifyInfo={
                  evmVerifyInfos?.[result.to?.toLowerCase() ?? ""] ?? null
                }
                txInput={result.input}
                variant="gray"
              />
            </AccordionPanel>
          </>
        );
      }}
    </AccordionItem>
  );
};
