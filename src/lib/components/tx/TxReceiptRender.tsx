import type { FlexProps, SystemStyleObject } from "@chakra-ui/react";
import type { ExecuteTxReceipt, StandardTxReceipt, TxReceipt } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

import { ArgsDisplayToggle } from "../ArgsDisplayToggle";
import { MoveExecuteArgsReceipt } from "../MoveExecuteArgsReceipt";

interface TxReceiptRenderProps extends FlexProps {
  keyPrefix?: string;
  receipts: TxReceipt[];
  variant?: "full" | "packed" | "tx-page";
}

const variantStyle: Record<
  Exclude<TxReceiptRenderProps["variant"], undefined>,
  SystemStyleObject
> = {
  full: {
    "> div": {
      alignItems: "center",
      justifyContent: "space-between",
    },
    "> div > p:first-of-type": {
      fontWeight: 600,
    },
    w: "full",
  },
  packed: {
    "> div": {
      alignItems: "center",
    },
    "> div > p:first-of-type": {
      fontWeight: 700,
      w: "140px",
    },
    w: "60%",
  },
  "tx-page": {
    "> div": {
      alignItems: "flex-start",
    },
    "> div > *.receipt-row-label": {
      color: "text.dark",
      fontWeight: 500,
      minW: "180px",
      mr: 4,
      w: "180px",
    },
    w: "full",
  },
};

const ReceiptExecuteArgsRow = ({ title, value }: ExecuteTxReceipt) => {
  const details = value; // Now properly typed
  const isJsonExecute = details.type === "/initia.move.v1.MsgExecuteJSON";
  const [displayMode, setDisplayMode] = useState<string | undefined>(
    isJsonExecute ? "raw" : "decoded"
  );

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      fontSize="14px"
      gap={4}
      w="full"
    >
      <Flex className="receipt-row-label">
        {isJsonExecute ? (
          <Text color="text.dark" variant="body2">
            {title}
          </Text>
        ) : (
          <ArgsDisplayToggle
            title={title}
            value={displayMode}
            onChange={(value) => setDisplayMode(value)}
          />
        )}
      </Flex>
      <MoveExecuteArgsReceipt
        displayMode={displayMode}
        functionName={details.function_name}
        moduleAddress={details.module_address}
        moduleName={details.module_name}
        rawArgs={Array.isArray(details.args) ? details.args : []}
      />
    </Flex>
  );
};

const ReceiptCommonRow = ({ html, title, value }: StandardTxReceipt) => (
  <Flex
    direction={{ base: "column", md: "row" }}
    fontSize="14px"
    gap={4}
    w="full"
  >
    <Text className="receipt-row-label" mb={{ base: 1, md: 0 }} variant="body2">
      {title}
    </Text>
    {html || (
      <Text
        color={value === null ? "gray.600" : "text.main"}
        variant="body2"
        wordBreak="break-word"
      >
        {String(value)}
      </Text>
    )}
  </Flex>
);

const ReceiptRow = (receipt: TxReceipt) =>
  receipt.type === "executeArgs" ? (
    <ReceiptExecuteArgsRow {...receipt} />
  ) : (
    <ReceiptCommonRow {...receipt} />
  );

export const TxReceiptRender = ({
  gap = 2,
  keyPrefix = "",
  receipts,
  variant = "packed",
  ...containerProps
}: TxReceiptRenderProps) => (
  <Flex
    direction="column"
    gap={gap}
    sx={variantStyle[variant]}
    {...containerProps}
  >
    {receipts.map((receipt, idx) => (
      <ReceiptRow
        key={keyPrefix + idx.toString() + receipt.title + receipt.value}
        {...receipt}
      />
    ))}
  </Flex>
);
