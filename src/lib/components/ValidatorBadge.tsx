import type { ImageProps } from "@chakra-ui/react";
import { Spinner, Flex, Image, Text } from "@chakra-ui/react";

import { useCelatoneApp, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { useValidatorImage } from "lib/services/validatorService";
import type { Nullable, Validator } from "lib/types";

import { MobileLabel } from "./table/MobileLabel";

interface ValidatorBadgeProps {
  validator: Nullable<Validator>;
  badgeSize?: ImageProps["boxSize"];
  ampCopierSection?: string;
  maxWidth?: string;
  hasLabel?: boolean;
}

const FallbackRender = ({
  badgeSize,
}: {
  badgeSize: ValidatorBadgeProps["badgeSize"];
}) => (
  <>
    <Image
      boxSize={badgeSize}
      src="https://raw.githubusercontent.com/alleslabs/assets/main/webapp-assets/asset/na-token.svg"
      alt="N/A"
      borderRadius="50%"
    />
    <Text variant="body2" color="text.disabled">
      N/A
    </Text>
  </>
);

export const ValidatorBadge = ({
  validator,
  badgeSize = 10,
  ampCopierSection,
  maxWidth = "160px",
  hasLabel = true,
}: ValidatorBadgeProps) => {
  const { theme } = useCelatoneApp();
  const { data: valImgSrc, isLoading } = useValidatorImage(validator, theme);
  const isMobile = useMobile();
  return (
    <Flex alignItems="center" gap={2}>
      {validator ? (
        <>
          {isLoading ? (
            <Spinner boxSize={badgeSize} />
          ) : (
            <Image
              boxSize={badgeSize}
              src={valImgSrc}
              alt={validator.moniker}
              borderRadius="50%"
              fallbackSrc="https://assets.alleslabs.dev/webapp-assets/placeholder/validator.svg"
              fallbackStrategy="beforeLoadOrError"
            />
          )}
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
          </Flex>
        </>
      ) : (
        <FallbackRender badgeSize={badgeSize} />
      )}
    </Flex>
  );
};
