import type {
  EvmInternalTxSequencer,
  EvmVerifyInfosResponse,
} from "lib/services/types";

import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
  Grid,
  type GridProps,
  Text,
} from "@chakra-ui/react";
import { EvmInputData } from "lib/components/EvmInputData";
import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { type AssetInfos, type Nullable, type Option } from "lib/types";
import {
  coinToTokenWithValue,
  formatEvmTxHash,
  formatInteger,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";
import { useMemo } from "react";

import { TableRow } from "../tableComponents";

interface EvmInternalTransactionTableRowProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: Option<string>;
  evmVerifyInfos: Option<Nullable<EvmVerifyInfosResponse>>;
  nestedIndex?: number;
  nestingLevel: number;
  result: EvmInternalTxSequencer;
  showParentHash?: boolean;
  templateColumns: GridProps["templateColumns"];
  txHash: Option<string>;
}

export const EvmInternalTransactionTableRow = ({
  assetInfos,
  evmDenom,
  evmVerifyInfos,
  nestedIndex = 0,
  nestingLevel,
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

  // Memoize tooltip labels for better performance
  const tooltipLabels = useMemo(() => {
    const fromContractName =
      evmVerifyInfos?.[result.from.toLowerCase()]?.contractName;
    const toContractName =
      evmVerifyInfos?.[result.to.toLowerCase()]?.contractName;

    return {
      from: fromContractName
        ? `${fromContractName} - ${result.from}`
        : result.from,
      to: toContractName ? `${toContractName} - ${result.to}` : result.to,
    };
  }, [evmVerifyInfos, result.from, result.to]);

  return (
    <AccordionItem
      sx={{
        containIntrinsicSize: "auto 75px",
        contentVisibility: "auto",
      }}
    >
      {({ isExpanded }) => (
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
              {showParentHash && (
                <TableRow>
                  {txHash ? (
                    <ExplorerLink
                      showCopyOnHover
                      type="tx_hash"
                      value={formatEvmTxHash(txHash)}
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
                <Flex align="center" w="full">
                  <Flex align="center" flexShrink={0}>
                    {Array.from({ length: nestingLevel }).map((_, index) => (
                      <CustomIcon
                        key={`${result.index}-level-${index}`}
                        boxSize={6}
                        color="gray.600"
                        marginLeft={index > 0 ? "-8px" : "0"}
                        name="l-shape"
                      />
                    ))}
                  </Flex>
                  <Flex flex={1} minW={0}>
                    <ExplorerLink
                      leftIcon={
                        <CustomIcon
                          color="primary.main"
                          name="contract-address"
                        />
                      }
                      showCopyOnHover
                      textFormat="ellipsis"
                      textLabel={
                        evmVerifyInfos?.[result.from.toLowerCase()]
                          ?.contractName
                      }
                      tooltipLabel={tooltipLabels.from}
                      type="user_address"
                      value={result.from}
                    />
                  </Flex>
                </Flex>
              </TableRow>
              <TableRow>
                <CustomIcon color="gray.600" name="arrow-right" />
              </TableRow>
              <TableRow>
                <ExplorerLink
                  leftIcon={
                    <CustomIcon color="primary.main" name="contract-address" />
                  }
                  showCopyOnHover
                  textLabel={
                    evmVerifyInfos?.[result.to.toLowerCase()]?.contractName
                  }
                  tooltipLabel={tooltipLabels.to}
                  type="user_address"
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
      )}
    </AccordionItem>
  );
};
