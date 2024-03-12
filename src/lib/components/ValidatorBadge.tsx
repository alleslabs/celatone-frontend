import type { ImageProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Nullable, Validator } from "lib/types";

import { MobileLabel } from "./table/MobileLabel";
import { ValidatorImage } from "./ValidatorImage";

interface ValidatorBadgeProps {
  validator: Nullable<Validator>;
  badgeSize?: ImageProps["boxSize"];
  ampCopierSection?: string;
  maxWidth?: string;
  hasLabel?: boolean;
  moreInfo?: JSX.Element;
}

export const ValidatorBadge = ({
  validator,
  badgeSize = 10,
  ampCopierSection,
  maxWidth = "160px",
  hasLabel = true,
  moreInfo,
}: ValidatorBadgeProps) => {
  const isMobile = useMobile();

  return (
    <Flex alignItems="center" gap={2}>
      {validator ? (
        <>
          <ValidatorImage validator={validator} boxSize={badgeSize} />
          <Flex direction="column">
            {isMobile && hasLabel && <MobileLabel label="Validator" />}
            <ExplorerLink
              value={validator.moniker ?? validator.validatorAddress}
              copyValue={validator.validatorAddress}
              type="validator_address"
              textFormat="ellipsis"
              showCopyOnHover
              ampCopierSection={ampCopierSection}
              maxWidth={maxWidth}
              fixedHeight
            />
            {moreInfo}
          </Flex>
        </>
      ) : (
        <>
          <ValidatorImage validator={validator} boxSize={badgeSize} />
          <Text variant="body2" color="text.disabled">
            N/A
          </Text>
        </>
      )}
    </Flex>
  );
};
