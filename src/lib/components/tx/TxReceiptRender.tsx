import type { FlexProps, SystemStyleObject } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import type { TxReceipt } from "lib/types";

interface TxReceiptRenderProps extends FlexProps {
  receipts: TxReceipt[];
  variant?: "full" | "packed";
}

const variantStyle: Record<
  Exclude<TxReceiptRenderProps["variant"], undefined>,
  SystemStyleObject
> = {
  full: {
    w: "100%",
    "> div": {
      justifyContent: "space-between",
    },
  },
  packed: {
    w: "50%",
    "> div > p:first-of-type": {
      w: "140px",
    },
  },
};

const ReceiptRow = ({ title, value, html }: TxReceipt) => (
  <Flex align="center" fontSize="14px">
    <Text variant="body2" fontWeight={700}>
      {title}
    </Text>
    {html || <Text variant="body2">{value}</Text>}
  </Flex>
);

export const TxReceiptRender = ({
  receipts,
  variant = "packed",
}: TxReceiptRenderProps) => (
  <Flex direction="column" gap="8px" sx={variantStyle[variant]}>
    {receipts.map((receipt) => (
      <ReceiptRow key={receipt.title} {...receipt} />
    ))}
  </Flex>
);
