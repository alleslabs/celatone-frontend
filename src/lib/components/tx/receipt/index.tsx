import type { FlexProps, SystemStyleObject } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import type { TxReceipt } from "lib/types";

interface TxReceiptRenderProps extends FlexProps {
  receipts: TxReceipt[];
  variant?: "full" | "packed" | "tx-page";
}

const variantStyle: Record<
  Exclude<TxReceiptRenderProps["variant"], undefined>,
  SystemStyleObject
> = {
  full: {
    w: "100%",
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
      w: "200px",
      color: "text.dark",
      fontWeight: 500,
    },
  },
};

const ReceiptRow = ({ title, value, html }: TxReceipt) => {
  return (
    <Flex fontSize="14px">
      <Text variant="body2">{title}</Text>
      {html || <Text variant="body2">{value}</Text>}
    </Flex>
  );
};

export const TxReceiptRender = ({
  receipts,
  variant = "packed",
}: TxReceiptRenderProps) => {
  return (
    <Flex direction="column" gap={2} sx={variantStyle[variant]}>
      {receipts.map((receipt) => (
        <ReceiptRow key={receipt.title} {...receipt} />
      ))}
    </Flex>
  );
};
