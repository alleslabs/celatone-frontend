import type { ImageProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import { isNull } from "lodash";

import { useCelatoneApp, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Nullable, Validator } from "lib/types";

import { MobileLabel } from "./table/MobileLabel";
import { ValidatorImage } from "./ValidatorImage";

interface ValidatorBadgeProps {
  ampCopierSection?: string;
  badgeSize?: ImageProps["boxSize"];
  hasLabel?: boolean;
  moreInfo?: JSX.Element;
  validator: Nullable<Validator>;
}

export const ValidatorBadge = ({
  ampCopierSection,
  badgeSize = 10,
  hasLabel = true,
  moreInfo,
  validator,
}: ValidatorBadgeProps) => {
  const isMobile = useMobile();
  const {
    chainConfig: {
      extra: { isValidatorExternalLink },
    },
  } = useCelatoneApp();

  return (
    <Flex alignItems="center" gap={2} w="full">
      <ValidatorImage validator={validator} boxSize={badgeSize} />
      {validator ? (
        <Flex minW={0} w="full" direction="column">
          {isMobile && hasLabel && <MobileLabel label="Validator" />}
          <ExplorerLink
            externalLink={
              isValidatorExternalLink
                ? `${isValidatorExternalLink}/${validator.validatorAddress}`
                : undefined
            }
            fixedHeight
            isReadOnly={isNull(isValidatorExternalLink)}
            type="validator_address"
            value={validator.moniker ?? validator.validatorAddress}
            ampCopierSection={ampCopierSection}
            copyValue={validator.validatorAddress}
            showCopyOnHover
            textFormat="ellipsis"
          />
          {moreInfo}
        </Flex>
      ) : (
        <Text variant="body2" color="text.disabled">
          N/A
        </Text>
      )}
    </Flex>
  );
};
