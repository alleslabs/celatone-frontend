import type { ImageProps } from "@chakra-ui/react";
import type { Nullable, Validator } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { isNull } from "lodash";

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
      <ValidatorImage boxSize={badgeSize} validator={validator} />
      {validator ? (
        <Flex direction="column" minW={0} w="full">
          {isMobile && hasLabel && <MobileLabel label="Validator" />}
          <ExplorerLink
            ampCopierSection={ampCopierSection}
            copyValue={validator.validatorAddress}
            externalLink={
              isValidatorExternalLink
                ? `${isValidatorExternalLink}/${validator.validatorAddress}`
                : undefined
            }
            fixedHeight
            isReadOnly={isNull(isValidatorExternalLink)}
            showCopyOnHover
            textFormat="ellipsis"
            type="validator_address"
            value={validator.moniker ?? validator.validatorAddress}
          />
          {moreInfo}
        </Flex>
      ) : (
        <Text color="text.disabled" variant="body2">
          N/A
        </Text>
      )}
    </Flex>
  );
};
