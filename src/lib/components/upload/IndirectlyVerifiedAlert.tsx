import { Alert, AlertDescription, Flex } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import type { Option } from "lib/types";
import { formatRelatedVerifiedCodes } from "lib/utils";

interface IndirectlyVerifiedAlertProps {
  relatedVerifiedCodes: Option<number[]>;
}

export const IndirectlyVerifiedAlert = ({
  relatedVerifiedCodes = [],
}: IndirectlyVerifiedAlertProps) => (
  <Alert variant="accent" alignItems="center">
    <Flex gap={2}>
      <CustomIcon name="info-circle" boxSize={4} />
      {/* TODO: add code that have the same hash */}
      <AlertDescription wordBreak="break-word">
        <span>
          This code has the same code hash as the following verified stored
          codes:
        </span>
        {formatRelatedVerifiedCodes(relatedVerifiedCodes)}
      </AlertDescription>
    </Flex>
  </Alert>
);
