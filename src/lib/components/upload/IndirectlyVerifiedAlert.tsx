import type { Option } from "lib/types";

import { Alert, AlertDescription, Flex } from "@chakra-ui/react";
import { formatRelatedVerifiedCodes } from "lib/utils";

import { CustomIcon } from "../icon";

interface IndirectlyVerifiedAlertProps {
  relatedVerifiedCodes: Option<number[]>;
}

export const IndirectlyVerifiedAlert = ({
  relatedVerifiedCodes = [],
}: IndirectlyVerifiedAlertProps) => (
  <Alert alignItems="center" variant="secondary">
    <Flex gap={2}>
      <CustomIcon boxSize={4} name="info-circle" />
      <AlertDescription wordBreak="break-word">
        <span style={{ fontWeight: 500 }}>
          This code has the same code hash as the following verified stored
          codes:
        </span>{" "}
        {formatRelatedVerifiedCodes(relatedVerifiedCodes)}
      </AlertDescription>
    </Flex>
  </Alert>
);
