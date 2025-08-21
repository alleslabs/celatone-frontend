import type { EvmCallFrame, EvmVerifyInfosResponse } from "lib/services/types";
import type { AssetInfos, Nullable, Option } from "lib/types";

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
                {showParentHash && (
                  <TableRow {...styles}>
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
                <TableRow {...styles}>
                  <ExplorerLink
                    leftIcon={
                      <CustomIcon
                        color="primary.main"
                        name="contract-address"
                      />
                    }
                    showCopyOnHover
                    textLabel={evmVerifyInfos?.[result.from]?.contractName}
                    type="evm_contract_address"
                    value={result.from}
                  />
                </TableRow>
                <TableRow {...styles}>
                  <CustomIcon color="gray.600" name="arrow-right" />
                </TableRow>
                <TableRow {...styles}>
                  <ExplorerLink
                    leftIcon={
                      <CustomIcon
                        color="primary.main"
                        name="contract-address"
                      />
                    }
                    showCopyOnHover
                    textLabel={evmVerifyInfos?.[result.to]?.contractName}
                    type="evm_contract_address"
                    value={result.to}
                  />
                </TableRow>
                <TableRow {...styles}>
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
                  {...styles}
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
                </TableRow>
                <TableRow {...styles}>
                  <Text color="text.dark" variant="body2">
                    {formatInteger(result.gas.toString())}
                  </Text>
                </TableRow>
                <TableRow justifyContent="flex-end" {...styles}>
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
