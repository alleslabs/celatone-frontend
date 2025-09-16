import type { ImageProps, SystemStyleObject } from "@chakra-ui/react";
import type { ExplorerLinkProps } from "lib/components/ExplorerLink";
import type { Nullable, Validator } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useCelatoneApp, useInitiaL1, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { isNull } from "lodash";

import { MobileLabel } from "./table/MobileLabel";
import { ValidatorImage } from "./ValidatorImage";

interface ValidatorBadgeProps
  extends Pick<ExplorerLinkProps, "fixedHeight" | "textFormat"> {
  ampCopierSection?: string;
  badgeSize?: ImageProps["boxSize"];
  hasLabel?: boolean;
  moreInfo?: JSX.Element;
  sx?: SystemStyleObject;
  validator: Nullable<Validator>;
}

export const ValidatorBadge = ({
  ampCopierSection,
  badgeSize = 10,
  fixedHeight = true,
  hasLabel = true,
  moreInfo,
  sx,
  textFormat = "ellipsis",
  validator,
}: ValidatorBadgeProps) => {
  const isMobile = useMobile();
  const {
    chainConfig: {
      extra: { isValidatorExternalLink },
    },
  } = useCelatoneApp();
  const isL1 = useInitiaL1({ shouldRedirect: false });

  return (
    <Flex alignItems="center" gap={1} sx={sx} w="full">
      <ValidatorImage boxSize={badgeSize} validator={validator} />
      {validator ? (
        <Flex direction="column" minW={0} w="full">
          {isMobile && hasLabel && <MobileLabel label="Validator" />}
          <ExplorerLink
            ampCopierSection={ampCopierSection}
            externalLink={
              isValidatorExternalLink
                ? `${isValidatorExternalLink}/${validator.validatorAddress}`
                : undefined
            }
            fixedHeight={fixedHeight}
            hideCopy={!isL1}
            isReadOnly={isNull(isValidatorExternalLink)}
            showCopyOnHover
            textFormat={textFormat}
            textLabel={validator.moniker ?? validator.validatorAddress}
            type="validator_address"
            value={validator.validatorAddress}
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
