import type { FlexProps, SystemStyleObject } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import type { TxReceipt } from "lib/types";

interface TxReceiptRenderProps extends FlexProps {
  receipts: TxReceipt[];
  variant?: "full" | "packed" | "tx-page";
  keyPrefix?: string;
}

const variantStyle: Record<
  Exclude<TxReceiptRenderProps["variant"], undefined>,
  SystemStyleObject
> = {
  full: {
    w: "full",
    "> div": {
      justifyContent: "space-between",
      alignItems: "center",
    },
    "> div > p:first-of-type": {
      fontWeight: 600,
    },
  },
  packed: {
    w: "60%",
    "> div": {
      alignItems: "center",
    },
    "> div > p:first-of-type": {
      w: "140px",
      fontWeight: 700,
    },
  },
  "tx-page": {
    w: "full",
    "> div": {
      alignItems: "flex-start",
    },
    "> div > p:first-of-type": {
      minW: "180px",
      w: "180px",
      mr: 4,
      color: "text.dark",
      fontWeight: 500,
    },
  },
};

const ReceiptRow = ({ title, value, html }: TxReceipt) => (
  <Flex
    fontSize="14px"
    w="full"
    direction={{ base: "column", md: "row" }}
    gap={4}
  >
    <Text variant="body2" mb={{ base: 1, md: 0 }} whiteSpace="nowrap">
      {title}
    </Text>
    {html || (
      <Text
        variant="body2"
        wordBreak="break-word"
        color={value === null ? "gray.600" : "text.main"}
      >
        {String(value)}
      </Text>
    )}
  </Flex>
);

export const TxReceiptRender = ({
  receipts,
  variant = "packed",
  gap = 2,
  keyPrefix = "",
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
