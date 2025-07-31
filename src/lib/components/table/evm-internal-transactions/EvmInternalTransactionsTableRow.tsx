import type { EvmCallFrame } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";

import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
  Grid,
  type GridProps,
  Text,
} from "@chakra-ui/react";
import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import {
  coinToTokenWithValue,
  formatInteger,
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";
import { isUndefined } from "lodash";

import { TableRow } from "../tableComponents";

interface EvmInternalTransactionTableRowProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: Option<string>;
  nestedIndex?: number;
  result: EvmCallFrame;
  showParentHash?: boolean;
  templateColumns: GridProps["templateColumns"];
  txHash: Option<string>;
}

export const EvmInternalTransactionTableRow = ({
  assetInfos,
  evmDenom,
  nestedIndex = 0,
  result,
  showParentHash = true,
  templateColumns,
  txHash,
}: EvmInternalTransactionTableRowProps) => {
  const token = coinToTokenWithValue(
    evmDenom ?? "",
    result.value?.toString() ?? "0",
    assetInfos
  );

  return (
    <>
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton p={0}>
              <Grid
                className="copier-wrapper"
                cursor="pointer"
                sx={{
                  "> div": {
                    paddingLeft: 0,
                    paddingRight: 0,
                  },
                }}
                templateColumns={templateColumns}
                w="full"
              >
                {showParentHash && (
                  <TableRow>
                    {txHash ? (
                      <ExplorerLink
                        showCopyOnHover
                        type="tx_hash"
                        value={txHash}
                      />
                    ) : (
                      <Flex>
                        {Array.from({ length: nestedIndex }).map((_, index) => (
                          <CustomIcon
                            key={`${nestedIndex}-${index}`}
                            color="gray.600"
                            name="arrow-right"
                          />
                        ))}
                      </Flex>
                    )}
                  </TableRow>
                )}
                <TableRow>
                  <ExplorerLink
                    leftIcon={
                      <CustomIcon
                        color="primary.main"
                        name="contract-address"
                      />
                    }
                    showCopyOnHover
                    type="contract_address"
                    value={result.from}
                  />
                </TableRow>
                <TableRow>
                  <CustomIcon color="gray.600" name="arrow-right" />
                </TableRow>
                <TableRow>
                  <ExplorerLink
                    leftIcon={
                      <CustomIcon
                        color="primary.main"
                        name="contract-address"
                      />
                    }
                    showCopyOnHover
                    type="contract_address"
                    value={result.to}
                  />
                </TableRow>
                <TableRow>
                  <Flex align="center" gap={1}>
                    <CustomIcon
                      boxSize={3}
                      color="success.main"
                      name="check-circle-solid"
                    />
                    <Text>{result.type.toLowerCase()}</Text>
                    <EvmMethodChip
                      txInput={result.input}
                      txTo={result.to}
                      width="auto"
                    />
                  </Flex>
                </TableRow>
                <TableRow
                  alignItems="start"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Text color="text.dark" variant="body2">
                    {formatUTokenWithPrecision(
                      token.amount,
                      token.precision ?? 0,
                      true,
                      token.precision ? 6 : 0
                    )}{" "}
                    {getTokenLabel(token.denom, token.symbol)}
                  </Text>
                  {!isUndefined(token.value) && (
                    <Text variant="body3">({formatPrice(token.value)})</Text>
                  )}
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
            <AccordionPanel>
              <Text color="text.secondary" variant="body2">
                Internal call details can go here (if any).
              </Text>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
      {/* // TODO: Reopen it again when integrate with real data */}
      {/* {result.calls?.map((call, index) => (
        <EvmInternalTransactionTableRow
          key={`${txHash ?? "nested"}-${nestedIndex}-${index}`}
          assetInfos={assetInfos}
          evmDenom={evmDenom}
          nestedIndex={nestedIndex + 1}
          result={call}
          showParentHash={showParentHash}
          templateColumns={templateColumns}
          txHash={undefined}
        />
      ))} */}
    </>
  );
};
