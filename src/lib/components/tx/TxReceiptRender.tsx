import type { FlexProps, SystemStyleObject } from "@chakra-ui/react";
import type { TxReceipt } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";

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
    "> div > p:first-of-type": {
      color: "text.dark",
      fontWeight: 500,
      minW: "180px",
      mr: 4,
      w: "180px",
    },
    w: "full",
  },
};

const ReceiptRow = ({ html, title, value }: TxReceipt) => (
  <Flex
    direction={{ base: "column", md: "row" }}
    fontSize="14px"
    gap={4}
    w="full"
  >
    <Text mb={{ base: 1, md: 0 }} variant="body2" whiteSpace="nowrap">
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
