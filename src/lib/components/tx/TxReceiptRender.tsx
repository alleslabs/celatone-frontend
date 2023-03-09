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
  },
  packed: {
    w: "50%",
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
  <Flex fontSize="14px" w="full">
    <Text variant="body2">{title}</Text>
    {html || (
      <Text variant="body2" wordBreak="break-word">
        {value}
      </Text>
    )}
  </Flex>
);

export const TxReceiptRender = ({
  receipts,
  variant = "packed",
  gap = 2,
  keyPrefix = "",
}: TxReceiptRenderProps) => (
  <Flex direction="column" gap={gap} sx={variantStyle[variant]}>
    {receipts.map((receipt, idx) => (
      <ReceiptRow
        key={keyPrefix + idx.toString() + receipt.title + receipt.value}
        {...receipt}
      />
    ))}
  </Flex>
);
