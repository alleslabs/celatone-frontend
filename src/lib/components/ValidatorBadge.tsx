import type { ImageProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { useCelatoneApp, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Nullable, Validator } from "lib/types";

import { MobileLabel } from "./table/MobileLabel";
import { ValidatorImage } from "./ValidatorImage";

interface ValidatorBadgeProps {
  validator: Nullable<Validator>;
  badgeSize?: ImageProps["boxSize"];
  ampCopierSection?: string;
  hasLabel?: boolean;
  moreInfo?: JSX.Element;
}

export const ValidatorBadge = ({
  validator,
  badgeSize = 10,
  ampCopierSection,
  hasLabel = true,
  moreInfo,
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
        <Flex direction="column" w="full" minW={0}>
          {isMobile && hasLabel && <MobileLabel label="Validator" />}
          <ExplorerLink
            type="validator_address"
            value={validator.moniker ?? validator.validatorAddress}
            copyValue={validator.validatorAddress}
            externalLink={
              isValidatorExternalLink
                ? `${isValidatorExternalLink}/${validator.validatorAddress}`
                : undefined
            }
            showCopyOnHover
            textFormat="ellipsis"
            ampCopierSection={ampCopierSection}
            fixedHeight
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
